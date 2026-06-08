"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Building2, User, CreditCard, Award } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea, Select, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { PageShell } from "@/components/shared";
import { toast } from "sonner";

const CATEGORIES = ["Manufacturing", "IT & Software", "Logistics", "Raw Materials", "Professional Services", "Electronics", "Energy", "Packaging", "Construction", "Healthcare"];
const COUNTRIES = ["United States", "Germany", "United Kingdom", "Canada", "Switzerland", "Japan", "India", "France", "Netherlands", "Australia"];
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60", "Net 90", "2/10 Net 30", "COD", "Prepaid"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "CHF", "JPY", "INR", "AUD"];

interface Contact { name: string; title: string; email: string; phone: string; isPrimary: boolean; }
interface BankAccount { bankName: string; accountNumber: string; routingNumber: string; currency: string; isDefault: boolean; }
interface Certification { name: string; issuer: string; issueDate: string; expiryDate: string; }

export default function CreateSupplierPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("company");

  // Company info
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Manufacturing");
  const [subCategory, setSubCategory] = useState("");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [taxId, setTaxId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [currency, setCurrency] = useState("USD");
  const [leadTimeDays, setLeadTimeDays] = useState("14");
  const [employeeCount, setEmployeeCount] = useState("");
  const [description, setDescription] = useState("");

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([{ name: "", title: "", email: "", phone: "", isPrimary: true }]);

  // Bank accounts
  const [banks, setBanks] = useState<BankAccount[]>([{ bankName: "", accountNumber: "", routingNumber: "", currency: "USD", isDefault: true }]);

  // Certifications
  const [certs, setCerts] = useState<Certification[]>([]);

  const addContact = () => setContacts(c => [...c, { name: "", title: "", email: "", phone: "", isPrimary: false }]);
  const removeContact = (i: number) => setContacts(c => c.filter((_, idx) => idx !== i));
  const updateContact = (i: number, field: keyof Contact, value: string | boolean) =>
    setContacts(c => c.map((ct, idx) => idx === i ? { ...ct, [field]: value } : ct));

  const addBank = () => setBanks(b => [...b, { bankName: "", accountNumber: "", routingNumber: "", currency: "USD", isDefault: false }]);
  const removeBank = (i: number) => setBanks(b => b.filter((_, idx) => idx !== i));
  const updateBank = (i: number, field: keyof BankAccount, value: string | boolean) =>
    setBanks(b => b.map((bk, idx) => idx === i ? { ...bk, [field]: value } : bk));

  const addCert = () => setCerts(c => [...c, { name: "", issuer: "", issueDate: "", expiryDate: "" }]);
  const removeCert = (i: number) => setCerts(c => c.filter((_, idx) => idx !== i));
  const updateCert = (i: number, field: keyof Certification, value: string) =>
    setCerts(c => c.map((ct, idx) => idx === i ? { ...ct, [field]: value } : ct));

  const handleSave = async (asDraft = false) => {
    if (!name.trim()) { toast.error("Company name is required"); setActiveTab("company"); return; }
    if (!email.trim()) { toast.error("Email is required"); setActiveTab("company"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success(`Supplier ${asDraft ? "saved as draft" : "submitted for review"} successfully!`);
    router.push("/suppliers");
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/suppliers" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div>
            <h1 className="text-base font-semibold">Register New Supplier</h1>
            <p className="text-xs text-muted-foreground">Complete all sections and submit for approval</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSave(true)} disabled={saving}>Save as Draft</Button>
          <Button size="sm" onClick={() => handleSave(false)} disabled={saving} className="gap-1.5">
            <Save size={14} />{saving ? "Submitting…" : "Submit for Review"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="company"><Building2 size={13} />Company Info</TabsTrigger>
          <TabsTrigger value="contacts"><User size={13} />Contacts</TabsTrigger>
          <TabsTrigger value="banking"><CreditCard size={13} />Banking</TabsTrigger>
          <TabsTrigger value="certifications"><Award size={13} />Certifications</TabsTrigger>
        </TabsList>

        {/* Company Info */}
        <TabsContent value="company">
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label className="text-xs">Company Name *</Label><Input className="mt-1" value={name} onChange={e => setName(e.target.value)} placeholder="Acme Corp Ltd" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Category *</Label>
                    <Select className="mt-1" value={category} onChange={e => setCategory(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </div>
                  <div><Label className="text-xs">Sub-Category</Label><Input className="mt-1" value={subCategory} onChange={e => setSubCategory(e.target.value)} placeholder="e.g. Metal Parts" /></div>
                </div>
                <div><Label className="text-xs">Business Description</Label><Textarea className="mt-1" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the supplier's products and services…" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Employee Count</Label><Input className="mt-1" type="number" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} placeholder="500" /></div>
                  <div><Label className="text-xs">Tax ID / VAT Number</Label><Input className="mt-1" value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="US-XX-XXXXXXX" /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Contact & Location</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label className="text-xs">Business Email *</Label><Input className="mt-1" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@company.com" /></div>
                <div><Label className="text-xs">Phone Number</Label><Input className="mt-1" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1-555-0100" /></div>
                <div><Label className="text-xs">Website</Label><Input className="mt-1" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://company.com" /></div>
                <div>
                  <Label className="text-xs">Country *</Label>
                  <Select className="mt-1" value={country} onChange={e => setCountry(e.target.value)}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">City</Label><Input className="mt-1" value={city} onChange={e => setCity(e.target.value)} placeholder="Chicago" /></div>
                  <div><Label className="text-xs">Address</Label><Input className="mt-1" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St" /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Commercial Terms</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Payment Terms</Label>
                    <Select className="mt-1" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}>
                      {PAYMENT_TERMS.map(p => <option key={p}>{p}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Preferred Currency</Label>
                    <Select className="mt-1" value={currency} onChange={e => setCurrency(e.target.value)}>
                      {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </div>
                </div>
                <div><Label className="text-xs">Standard Lead Time (days)</Label><Input className="mt-1" type="number" value={leadTimeDays} onChange={e => setLeadTimeDays(e.target.value)} /></div>
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 text-xs text-blue-700 dark:text-blue-300">
                  Once approved, a Vendor record will automatically be created in Business Central with these commercial terms.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contacts */}
        <TabsContent value="contacts">
          <div className="space-y-4">
            {contacts.map((c, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Contact {i + 1} {c.isPrimary && <span className="ml-2 text-xs text-emerald-600 font-normal">(Primary)</span>}</CardTitle>
                    {contacts.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeContact(i)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label className="text-xs">Full Name *</Label><Input className="mt-1" value={c.name} onChange={e => updateContact(i, "name", e.target.value)} placeholder="Jane Smith" /></div>
                    <div><Label className="text-xs">Job Title</Label><Input className="mt-1" value={c.title} onChange={e => updateContact(i, "title", e.target.value)} placeholder="Account Manager" /></div>
                    <div><Label className="text-xs">Email *</Label><Input className="mt-1" type="email" value={c.email} onChange={e => updateContact(i, "email", e.target.value)} placeholder="jane@company.com" /></div>
                    <div><Label className="text-xs">Phone</Label><Input className="mt-1" value={c.phone} onChange={e => updateContact(i, "phone", e.target.value)} placeholder="+1-555-0100" /></div>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-xs cursor-pointer">
                    <input type="checkbox" checked={c.isPrimary} onChange={e => { setContacts(cs => cs.map((ct, idx) => ({ ...ct, isPrimary: idx === i ? e.target.checked : false }))); }} />
                    Set as primary contact
                  </label>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" size="sm" onClick={addContact} className="gap-1.5"><Plus size={14} />Add Contact</Button>
          </div>
        </TabsContent>

        {/* Banking */}
        <TabsContent value="banking">
          <div className="space-y-4">
            {banks.map((b, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Bank Account {i + 1} {b.isDefault && <span className="ml-2 text-xs text-emerald-600 font-normal">(Default)</span>}</CardTitle>
                    {banks.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeBank(i)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label className="text-xs">Bank Name *</Label><Input className="mt-1" value={b.bankName} onChange={e => updateBank(i, "bankName", e.target.value)} placeholder="Chase Bank" /></div>
                    <div><Label className="text-xs">Account Number *</Label><Input className="mt-1" value={b.accountNumber} onChange={e => updateBank(i, "accountNumber", e.target.value)} placeholder="XXXXXXXXXX" /></div>
                    <div><Label className="text-xs">Routing / SWIFT / IBAN</Label><Input className="mt-1" value={b.routingNumber} onChange={e => updateBank(i, "routingNumber", e.target.value)} placeholder="021000021" /></div>
                    <div>
                      <Label className="text-xs">Account Currency</Label>
                      <Select className="mt-1" value={b.currency} onChange={e => updateBank(i, "currency", e.target.value)}>
                        {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                      </Select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-xs cursor-pointer">
                    <input type="checkbox" checked={b.isDefault} onChange={e => { setBanks(bks => bks.map((bk, idx) => ({ ...bk, isDefault: idx === i ? e.target.checked : false }))); }} />
                    Set as default payment account
                  </label>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" size="sm" onClick={addBank} className="gap-1.5"><Plus size={14} />Add Bank Account</Button>
          </div>
        </TabsContent>

        {/* Certifications */}
        <TabsContent value="certifications">
          <div className="space-y-4">
            {certs.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <Award size={28} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No certifications added</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">Add ISO, compliance, or industry certifications</p>
                <Button variant="outline" size="sm" onClick={addCert} className="gap-1.5"><Plus size={14} />Add Certification</Button>
              </div>
            )}
            {certs.map((c, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Certification {i + 1}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => removeCert(i)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label className="text-xs">Certification Name *</Label><Input className="mt-1" value={c.name} onChange={e => updateCert(i, "name", e.target.value)} placeholder="ISO 9001:2015" /></div>
                    <div><Label className="text-xs">Issuing Body *</Label><Input className="mt-1" value={c.issuer} onChange={e => updateCert(i, "issuer", e.target.value)} placeholder="Bureau Veritas" /></div>
                    <div><Label className="text-xs">Issue Date</Label><Input className="mt-1" type="date" value={c.issueDate} onChange={e => updateCert(i, "issueDate", e.target.value)} /></div>
                    <div><Label className="text-xs">Expiry Date</Label><Input className="mt-1" type="date" value={c.expiryDate} onChange={e => updateCert(i, "expiryDate", e.target.value)} /></div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {certs.length > 0 && (
              <Button variant="outline" size="sm" onClick={addCert} className="gap-1.5"><Plus size={14} />Add Another Certification</Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
