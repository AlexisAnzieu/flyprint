import { WIFI_PASSWORD, WIFI_SSID } from "@/lib/constants";

const profile = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key><string>com.apple.wifi.managed</string>
      <key>PayloadVersion</key><integer>1</integer>
      <key>PayloadIdentifier</key><string>com.flyprint.wifi.payload</string>
      <key>PayloadUUID</key><string>EC5FEE3C-46EC-49FB-B1A8-56AEAAE509ED</string>
      <key>PayloadDisplayName</key><string>Wi-Fi</string>
      <key>SSID_STR</key><string>${WIFI_SSID}</string>
      <key>EncryptionType</key><string>WPA</string>
      <key>Password</key><string>${WIFI_PASSWORD}</string>
      <key>AutoJoin</key><true/>
      <key>HIDDEN_NETWORK</key><false/>
    </dict>
  </array>
  <key>PayloadType</key><string>Configuration</string>
  <key>PayloadVersion</key><integer>1</integer>
  <key>PayloadIdentifier</key><string>com.flyprint.wifi</string>
  <key>PayloadUUID</key><string>115BE229-BDCE-491B-821A-34589B56687E</string>
  <key>PayloadDisplayName</key><string>${WIFI_SSID}</string>
</dict>
</plist>
`;

export async function GET() {
  return new Response(profile, {
    headers: {
      "Content-Type": "application/x-apple-aspen-config",
      "Content-Disposition": 'attachment; filename="wifi.mobileconfig"',
    },
  });
}
