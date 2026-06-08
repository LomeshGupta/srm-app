"use client";
import { useState } from "react";
import { PageShell } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Switch, Tabs, TabsList, TabsTrigger, TabsContent, Avatar, Badge, Select } from "@/components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Bell, Shield, Database, Palette, Globe, Key, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();
  if (!user) return null;
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [contractAlerts, setContractAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [syncAlerts, setSyncAlerts] = useState(true);

  return (
    <PageShell>
      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="profile"><User size={14} />Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell size={14} />Notifications</TabsTrigger>
          <TabsTrigger value="integration"><Database size={14} />BC Integration</TabsTrigger>
          <TabsTrigger value="security"><Shield size={14} />Security</TabsTrigger>
          <TabsTrigger value="appearance"><Palette size={14} />Appearance</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <CardHeader><CardTitle>User Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar name={user.name} size="lg" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-xs">Change Avatar</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div><Label className="text-xs">Full Name</Label><Input defaultValue={user.name} className="mt-1" /></div>
                  <div><Label className="text-xs">Email</Label><Input defaultValue={user.email} className="mt-1" /></div>
                  <div><Label className="text-xs">Department</Label><Input defaultValue={user.department} className="mt-1" /></div>
                  <div>
                    <Label className="text-xs">Role</Label>
                    <Select defaultValue={user.role} className="mt-1">
                      {["Admin","Procurement Manager","Supplier","Finance User","Executive"].map(r=><option key={r}>{r}</option>)}
                    </Select>
                  </div>
                </div>
                <Button onClick={() => toast.success("Profile updated")} className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label className="text-xs">Company Name</Label><Input defaultValue="Contoso Corporation" className="mt-1" /></div>
                <div><Label className="text-xs">Industry</Label><Input defaultValue="Manufacturing" className="mt-1" /></div>
                <div><Label className="text-xs">Country</Label><Input defaultValue="United States" className="mt-1" /></div>
                <div><Label className="text-xs">Base Currency</Label>
                  <Select defaultValue="USD" className="mt-1">
                    {["USD","EUR","GBP","CAD","CHF","JPY"].map(c=><option key={c}>{c}</option>)}
                  </Select>
                </div>
                <div><Label className="text-xs">Fiscal Year Start</Label>
                  <Select defaultValue="January" className="mt-1">
                    {["January","April","July","October"].map(m=><option key={m}>{m}</option>)}
                  </Select>
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.success("Organization settings saved")}>Save</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: "Email Notifications", desc: "Receive notifications via email", value: emailNotifs, setter: setEmailNotifs },
                { label: "Push Notifications", desc: "In-app push notifications", value: pushNotifs, setter: setPushNotifs },
                { label: "Contract Expiry Alerts", desc: "Alert when contracts are within renewal period", value: contractAlerts, setter: setContractAlerts },
                { label: "Risk Score Alerts", desc: "Alert when supplier risk level increases", value: riskAlerts, setter: setRiskAlerts },
                { label: "BC Sync Failure Alerts", desc: "Alert when vendor sync fails in Business Central", value: syncAlerts, setter: setSyncAlerts },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}
              <div className="space-y-2">
                <Label className="text-xs">Contract Renewal Notification (days before)</Label>
                <Select defaultValue="90" className="mt-1">
                  {["30","60","90","120"].map(d=><option key={d}>{d} days</option>)}
                </Select>
              </div>
              <Button onClick={() => toast.success("Notification preferences saved")} className="w-full">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BC Integration */}
        <TabsContent value="integration">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Database size={16} />Business Central Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label className="text-xs">BC Environment URL</Label><Input defaultValue="https://api.businesscentral.dynamics.com/v2.0/" className="mt-1 font-mono text-xs" /></div>
                <div><Label className="text-xs">Company ID</Label><Input defaultValue="CRONUS" className="mt-1 font-mono text-xs" /></div>
                <div><Label className="text-xs">Tenant ID</Label><Input defaultValue="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="mt-1 font-mono text-xs" /></div>
                <div><Label className="text-xs">Client ID (Azure AD)</Label><Input defaultValue="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="mt-1 font-mono text-xs" /></div>
                <div><Label className="text-xs">Client Secret</Label><Input type="password" defaultValue="supersecret" className="mt-1 font-mono text-xs" /></div>
                <div><Label className="text-xs">API Version</Label>
                  <Select defaultValue="v2.0" className="mt-1"><option>v2.0</option><option>v1.0</option></Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => toast.success("Connection test successful!")}>Test Connection</Button>
                <Button className="flex-1" onClick={() => toast.success("BC settings saved")}>Save Settings</Button>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <p className="text-xs font-semibold">Azure Service Bus</p>
                <div><Label className="text-xs">Connection String</Label><Input type="password" defaultValue="Endpoint=sb://..." className="mt-1 font-mono text-xs" /></div>
                <div><Label className="text-xs">Topic Name</Label><Input defaultValue="srm-events" className="mt-1 font-mono text-xs" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div><Label className="text-xs">Current Password</Label><Input type="password" className="mt-1" /></div>
                <div><Label className="text-xs">New Password</Label><Input type="password" className="mt-1" /></div>
                <div><Label className="text-xs">Confirm New Password</Label><Input type="password" className="mt-1" /></div>
              </div>
              <Button onClick={() => toast.success("Password updated")} className="w-full">Update Password</Button>
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add extra security with 2FA</p></div>
                  <Switch checked={false} onCheckedChange={() => toast.info("2FA setup flow would launch here")} />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Session Timeout</p><p className="text-xs text-muted-foreground">Auto logout after inactivity</p></div>
                  <Select defaultValue="30" className="w-28">
                    {["15","30","60","120"].map(v=><option key={v}>{v} min</option>)}
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Switch between light and dark themes</p></div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div>
                <Label className="text-xs">Language</Label>
                <Select defaultValue="en" className="mt-1">
                  <option value="en">English</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="ja">Japanese</option>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Date Format</Label>
                <Select defaultValue="MMM DD YYYY" className="mt-1">
                  <option>MMM DD YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Default Currency Display</Label>
                <Select defaultValue="symbol" className="mt-1">
                  <option value="symbol">Symbol ($, €)</option>
                  <option value="code">Code (USD, EUR)</option>
                </Select>
              </div>
              <Button onClick={() => toast.success("Appearance settings saved")} className="w-full">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
