import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-drive',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Drive not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGoogleDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function uploadUserDataToDrive(users: any[]) {
  const drive = await getUncachableGoogleDriveClient();
  
  // Format the data as CSV
  const headers = 'Profile Name,Actual Name,Role,Email,Age,City,State,User ID\n';
  const rows = users.map(user => 
    `"${user.profileName || ''}","${user.name}","${user.role}","${user.email || ''}","${user.age || ''}","${user.city || ''}","${user.state || ''}","${user.id}"`
  ).join('\n');
  
  const csvContent = headers + rows;
  const fileName = `ExecutiveSociety_UserData_${new Date().toISOString().split('T')[0]}.csv`;
  
  // Check if file already exists
  const existingFiles = await drive.files.list({
    q: `name='${fileName}' and trashed=false`,
    fields: 'files(id, name)',
  });

  if (existingFiles.data.files && existingFiles.data.files.length > 0) {
    // Update existing file
    const fileId = existingFiles.data.files[0].id;
    const response = await drive.files.update({
      fileId: fileId!,
      media: {
        mimeType: 'text/csv',
        body: csvContent,
      },
    });
    return response.data;
  } else {
    // Create new file
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'text/csv',
      },
      media: {
        mimeType: 'text/csv',
        body: csvContent,
      },
      fields: 'id, name, webViewLink',
    });
    return response.data;
  }
}
