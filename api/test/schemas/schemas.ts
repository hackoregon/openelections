// Schema pulled from: https://sos.oregon.gov/elections/Documents/xml_specs.pdf

export const xmlWrapper = (...schemas: string[]) => {
  console.log(schemas.length);
  return `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">${schemas.join('')}</xs:schema>`;
};

export const addressSchema = `
<xs:element name="address">
<xs:complexType>
<xs:sequence>
<xs:element name="street1" minOccurs="0">
<xs:annotation><xs:documentation>First Line of the address</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="40"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="street2" minOccurs="0">
<xs:annotation>
<xs:documentation>Second line of the address</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="40"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="city" minOccurs="0">
<xs:annotation>
<xs:documentation> </xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="100"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="state" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:length value="2"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="zip" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:integer">
<xs:totalDigits value="5"/>
<xs:pattern value="\d{5}"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="zip-plus4" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:integer">
<xs:totalDigits value="4"/>
<xs:pattern value="\d{4}"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="fgn-post-code" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="100"/>
</xs:restriction></xs:simpleType>
</xs:element>
<xs:element name="country-code" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="4"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="county" minOccurs="0">
<xs:annotation>
<xs:documentation>The county where a payee is located, if not located in a
city.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="30"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>`;

export const addressXSD = `<xs:element name="address">
<xs:complexType>
<xs:sequence>
<xs:element name="street1" minOccurs="0">
<xs:annotation>
<xs:documentation>First Line of the address</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="40"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="street2" minOccurs="0">
 <xs:annotation>
 <xs:documentation>Second line of the address</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="40"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="city" minOccurs="0">
 <xs:annotation>
 <xs:documentation> </xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="100"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="state" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:length value="2"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="zip" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:integer">
 <xs:totalDigits value="5"/>
 <xs:pattern value="\\d{5}"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="zip-plus4" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:integer">
 <xs:totalDigits value="4"/>
 <xs:pattern value="\\d{4}"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="fgn-post-code" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="100"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="country-code" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="4"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="county" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The county where a payee is located, if not located in a
city.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:complexType>
</xs:element>`;


// TODO: element street1 should have attribute: minOccurs="0"
export const street1XSD = `
<xs:element name="street1">
<xs:annotation>
<xs:documentation>First Line of the address</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="40"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

// TODO: element street2 should have attribute: minOccurs="0"
export const street2XSD = `
<xs:element name="street2">
 <xs:annotation>
 <xs:documentation>Second line of the address</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="40"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

// TODO: element city should have attribute: minOccurs="0"
export const cityXSD = `
<xs:element name="city">
 <xs:annotation>
 <xs:documentation> </xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="100"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

// TODO: element state should have attribute: minOccurs="0"
export const stateXSD = `<xs:element name="state">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:length value="2"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

// TODO: element zip should have attribute: minOccurs="0"; changed \d{5} to \\d{5}
export const zipXSD = `<xs:element name="zip">
<xs:simpleType>
<xs:restriction base="xs:integer">
<xs:totalDigits value="5"/>
<xs:pattern value="\\d{5}"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

// TODO: element zip plus four should have attribute: minOccurs="0"; changed \d{4} to \\d{4}
export const zipPlusFourXSD = `<xs:element name="zip-plus4">
 <xs:simpleType>
 <xs:restriction base="xs:integer">
 <xs:totalDigits value="4"/>
 <xs:pattern value="\\d{4}"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

// TODO: element fgnPostCode should have attribute: minOccurs="0"
export const fgnPostCodeXSD = `
<xs:element name="fgn-post-code">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="100"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

// TODO: element country-code should have attribute: minOccurs="0"
export const countryCodeXSD = `
<xs:element name="country-code">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="4"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

// TODO: element county should have attribute: minOccurs="0"
export const countyXSD = `
<xs:element name="county">
 <xs:annotation>
 <xs:documentation>The county where a payee is located, if not located in a
city.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

export const amountXSD = `
<xs:element name="amount">
 <xs:simpleType>
 <xs:restriction base="xs:decimal"/>
 </xs:simpleType>
</xs:element>`;

export const associatedTranXSD = `
<xs:element name="associated-tran">
<xs:complexType>
<xs:sequence>
<xs:element name="id">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:minLength value="1"/>
<xs:maxLength value="30"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="complete">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:enumeration value="Y"/>
<xs:enumeration value="N"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>`;

export const associatedIdXSD = `
<xs:element name="id">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:minLength value="1"/>
<xs:maxLength value="30"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
`;

export const associatedCompleteXSD = `
<xs:element name="complete">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="Y"/>
 <xs:enumeration value="N"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>`;

export const campaignFinanceTransactionsXSD = `
<xs:element name="campaign-finance-transactions">
 <xs:annotation>
 <xs:documentation>Committee Transactions by contact</xs:documentation>
 </xs:annotation>
 <xs:complexType>
 <xs:sequence>
 <xs:element ref="contact" minOccurs="0" maxOccurs="2000">
 <xs:annotation>
 <xs:documentation>an individuals, business/organization or committee that has contributed
to, been paid by or has a reportable connection with the committee.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element ref="transaction" maxOccurs="2000"/>
 </xs:sequence>
 <xs:attribute name="filer-id" type="xs:positiveInteger" use="required"/>
 </xs:complexType>
</xs:element>`;

export const contactXSD = `
<xs:element name="contact">
 <xs:annotation>
 <xs:documentation> Individuals, Businesses or Committees that have donated to, been paid
by or have a reportable connection with the committee.</xs:documentation>
 </xs:annotation>
 <xs:complexType>
 <xs:sequence>
 <xs:element name="type">
 <xs:annotation>
 <xs:documentation>Type of contact.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="B"/>
 <xs:enumeration value="C"/>
 <xs:enumeration value="F"/>
 <xs:enumeration value="I"/>
 <xs:enumeration value="L"/>
 <xs:enumeration value="O"/>
 <xs:enumeration value="P"/>
 <xs:enumeration value="U"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="contact-name"/>
 <xs:element ref="address" minOccurs="0"/>
 <xs:element ref="phone" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The phone numbers for the contact.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="email" minOccurs="0">
 <xs:annotation>
 <xs:documentation>This is the E-Mail address for the contact</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="60"/>
 <xs:pattern value=".+@.+[.]..+"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="occupation" minOccurs="0">
 <xs:annotation>
 <xs:documentation>Nature of an individual’s primary job or business.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="100"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="employment" minOccurs="0"/>
 </xs:sequence>
 <xs:attribute name="id" use="required">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="1"/>
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:attribute>
 </xs:complexType>
</xs:element>`;

export const contactSchema1 = `
<xs:element name="contact">
 <xs:annotation>
 <xs:documentation> Individuals, Businesses or Committees that have donated to, been paid
by or have a reportable connection with the committee.</xs:documentation>
 </xs:annotation>
 <xs:complexType>
 <xs:sequence>
 <xs:element name="type">
 <xs:annotation>
 <xs:documentation>Type of contact.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="B"/>
 <xs:enumeration value="C"/>
 <xs:enumeration value="F"/>
 <xs:enumeration value="I"/>
 <xs:enumeration value="L"/>
 <xs:enumeration value="O"/>
 <xs:enumeration value="P"/>
 <xs:enumeration value="U"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="contact-name"/>
 <xs:element ref="address" minOccurs="0"/>
 <xs:element ref="phone" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The phone numbers for the contact.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="email" minOccurs="0">
 <xs:annotation>
 <xs:documentation>This is the E-Mail address for the contact</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="60"/>
 <xs:pattern value=".+@.+[.]..+"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="occupation" minOccurs="0">
 <xs:annotation>
 <xs:documentation>Nature of an individual’s primary job or business.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="100"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="employment" minOccurs="0"/>
 </xs:sequence>
 <xs:attribute name="id" use="required">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="1"/>
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:attribute>
 </xs:complexType>
</xs:element>
<xs:element name="contact-name">
 <xs:complexType>
 <xs:choice>
 <xs:element ref="individual-name"/>
<xs:sequence>
 <xs:element name="business-name">
 <xs:annotation>
 <xs:documentation>The business or organization name.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="60"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="individual-name" minOccurs="0"/>
 </xs:sequence>
 <xs:element name="committee">
 <xs:annotation>
 <xs:documentation>The committee number for a state registered committee or the
committee name for non-state registered committee.</xs:documentation>
 </xs:annotation>
 <xs:complexType>
 <xs:choice>
 <xs:element name="id" type="xs:positiveInteger">
 <xs:annotation>
 <xs:documentation>Committee ID</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="name">
 <xs:annotation>
 <xs:documentation>Committee Name</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="80"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:choice>
 </xs:complexType>
 </xs:element>
 </xs:choice>
 </xs:complexType>
</xs:element>
<xs:element name="phone">
 <xs:annotation>
 <xs:documentation>This is the phone number for the contact</xs:documentation>
 </xs:annotation>
 <xs:complexType>
 <xs:sequence>
 <xs:element name="work" minOccurs="0">
<xs:annotation>
 <xs:documentation>the format was \d{3}-\d{3}-\d{4}(\sExt\s[0-
9999999])?</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="10"/>
 <xs:maxLength value="15"/>
 <xs:whiteSpace value="collapse"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="work-extension" minOccurs="0">
 <xs:annotation>
 <xs:documentation>This is the extension number for the work phone</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="5"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="home" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="10"/>
 <xs:maxLength value="15"/>
 <xs:whiteSpace value="collapse"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="fax" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="10"/>
 <xs:maxLength value="15"/>
 <xs:whiteSpace value="collapse"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:complexType>
</xs:element>
<xs:element name="address">
<xs:complexType>
<xs:sequence>
<xs:element name="street1" minOccurs="0">
<xs:annotation><xs:documentation>First Line of the address</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="40"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="street2" minOccurs="0">
<xs:annotation>
<xs:documentation>Second line of the address</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="40"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="city" minOccurs="0">
<xs:annotation>
<xs:documentation> </xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="100"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="state" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:length value="2"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="zip" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:integer">
<xs:totalDigits value="5"/>
<xs:pattern value="\\d{5}"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="zip-plus4" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:integer">
<xs:totalDigits value="4"/>
<xs:pattern value="\d{4}"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="fgn-post-code" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="100"/>
</xs:restriction></xs:simpleType>
</xs:element>
<xs:element name="country-code" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="4"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="county" minOccurs="0">
<xs:annotation>
<xs:documentation>The county where a payee is located, if not located in a
city.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="30"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="individual-name">
 <xs:complexType>
 <xs:sequence>
 <xs:element name="prefix" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="3"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="first">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
<xs:element name="middle" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="last">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="suffix" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="3"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="title" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The contacts working title</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:complexType>
</xs:element>
<xs:element name="employment">
 <xs:complexType>
 <xs:choice>
 <xs:element name="not-employed" type="xs:string" fixed="Yes">
 <xs:annotation>
 <xs:documentation>Identifies the contact as not employed.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="self-employed" type="xs:string" fixed="Yes">
 <xs:annotation>
 <xs:documentation>Identifies the contact as self-employed.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:sequence>
<xs:element name="employer-name">
 <xs:annotation>
 <xs:documentation>The name of the individuals employer</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="80"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="city" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The city where the employer is located.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="40"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="state" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The state where the employer is located.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:length value="2"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:choice>
 </xs:complexType>
</xs:element>
`;

export const contactIdXSD = `
<xs:element name="contact">
 <xs:annotation>
 <xs:documentation> Individuals, Businesses or Committees that have donated to, been paid
by or have a reportable connection with the committee.</xs:documentation>
 </xs:annotation>
 <xs:complexType>
<xs:attribute name="id" use="required">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="1"/>
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
</xs:attribute>
</xs:complexType>
</xs:element>
`;

export const contactTypeXSD = `
<xs:element name="type">
 <xs:annotation>
 <xs:documentation>Type of contact.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="B"/>
 <xs:enumeration value="C"/>
 <xs:enumeration value="F"/>
 <xs:enumeration value="I"/>
 <xs:enumeration value="L"/>
 <xs:enumeration value="O"/>
 <xs:enumeration value="P"/>
 <xs:enumeration value="U"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

// TODO: element contact email should have attribute: minOccurs="0"
export const contactEmailSchema = `
<xs:element name="email" minOccurs="0">
 <xs:annotation>
 <xs:documentation>This is the E-Mail address for the contact</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="60"/>
 <xs:pattern value=".+@.+[.]..+"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

// TODO: element contact occupation should have attribute: minOccurs="0"
export const contactOccupationXSD = `
<xs:element name="occupation">
 <xs:annotation>
 <xs:documentation>Nature of an individual’s primary job or business.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="100"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>`;

export const contactNameXSD = `
<xs:element name="contact-name">
 <xs:complexType>
 <xs:choice>
 <xs:element ref="individual-name"/>
 <xs:sequence>
 <xs:element name="business-name">
 <xs:annotation>
 <xs:documentation>The business or organization name.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="60"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="individual-name" minOccurs="0"/>
 </xs:sequence>
 <xs:element name="committee">
 <xs:annotation>
 <xs:documentation>The committee number for a state registered committee or the
committee name for non-state registered committee.</xs:documentation>
 </xs:annotation>
 <xs:complexType>
 <xs:choice>
 <xs:element name="id" type="xs:positiveInteger">
 <xs:annotation>
 <xs:documentation>Committee ID</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="name">
 <xs:annotation>
 <xs:documentation>Committee Name</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="80"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:choice>
 </xs:complexType>
 </xs:element>
 </xs:choice>
 </xs:complexType>
</xs:element>
<xs:element name="individual-name">
 <xs:complexType>
 <xs:sequence>
 <xs:element name="prefix" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="3"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="first">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
<xs:element name="middle" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="last">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="suffix" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="3"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="title" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The contacts working title</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="20"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:complexType>
</xs:element>`;

export const contactBusinessNameXSD = `
<xs:element name="business-name">
 <xs:annotation>
 <xs:documentation>The business or organization name.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="60"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>
`;

export const contactNameCommitteeXSD = `
<xs:element name="committee">
 <xs:annotation>
 <xs:documentation>The committee number for a state registered committee or the committee
name for non-state registered committee.</xs:documentation>
 </xs:annotation>
 <xs:complexType>
 <xs:choice>
 <xs:element name="id" type="xs:positiveInteger">
 <xs:annotation>
 <xs:documentation>Committee ID</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="name">
 <xs:annotation>
 <xs:documentation>Committee Name</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="80"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:choice>
 </xs:complexType>
</xs:element>`;

export const employmentXSD = `
<xs:element name="employment">
 <xs:complexType>
 <xs:choice>
 <xs:element name="not-employed" type="xs:string" fixed="Yes">
 <xs:annotation>
 <xs:documentation>Identifies the contact as not employed.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="self-employed" type="xs:string" fixed="Yes">
 <xs:annotation>
 <xs:documentation>Identifies the contact as self-employed.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:sequence>
 <xs:element name="employer-name">
 <xs:annotation>
 <xs:documentation>The name of the individuals employer</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="80"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="city" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The city where the employer is located.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="40"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="state" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The state where the employer is located.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:length value="2"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:choice>
 </xs:complexType>
</xs:element>`;


export const transactionXSD = `<xs:element name="transaction">
<xs:complexType>
<xs:sequence>
<xs:element name="operation">
<xs:annotation>
<xs:documentation>The operation that the transaction is performing.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:choice>
<xs:element name="add" type="xs:boolean">
<xs:annotation>
<xs:documentation>submit a transaction</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="amend">
<xs:annotation>
<xs:documentation>amend a pre submitted transaction.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:boolean"/>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="delete">
<xs:annotation>
<xs:documentation>delete a pre submitted transaction</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:boolean"/>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:choice>
</xs:complexType>
</xs:element>
<xs:element name="contact-id" minOccurs="0">
<xs:annotation>
<xs:documentation>payee id / contributor id</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:minLength value="1"/>
<xs:maxLength value="30"/>
</xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="agent-id" minOccurs="0">
 <xs:annotation>
 <xs:documentation>Agent Id from Address Book</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="1"/>
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="expend-id" minOccurs="0">
 <xs:annotation>
 <xs:documentation>Personal Expenditure Id from Address Book</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="1"/>
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="type">
 <xs:annotation>
 <xs:documentation>The general category of the transaction.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="C"/>
 <xs:enumeration value="E"/>
 <xs:enumeration value="OR"/>
 <xs:enumeration value="OD"/>
 <xs:enumeration value="OA"/>
 <xs:enumeration value="O"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="sub-type">
 <xs:annotation>
 <xs:documentation>The specific category of the transaction; the subtype must be related to
the type.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="CA"/>
 <xs:enumeration value="IK"/>
 <xs:enumeration value="IKP"/>
 <xs:enumeration value="IKA"/>
 <xs:enumeration value="NLR"/>
 <xs:enumeration value="PL"/>
 <xs:enumeration value="PI"/>
 <xs:enumeration value="PC"/>
 <xs:enumeration value="ELR"/>
 <xs:enumeration value="FM"/>
 <xs:enumeration value="IN"/>
 <xs:enumeration value="OM"/>
 <xs:enumeration value="RF"/>
 <xs:enumeration value="LC"/>
 <xs:enumeration value="OR"/>
 <xs:enumeration value="AE"/>
 <xs:enumeration value="PE"/>
 <xs:enumeration value="CE"/>
 <xs:enumeration value="AP"/>
 <xs:enumeration value="NLP"/>
 <xs:enumeration value="ELP"/>
 <xs:enumeration value="NP"/>
 <xs:enumeration value="RT"/>
 <xs:enumeration value="UIP"/>
 <xs:enumeration value="UCP"/>
 <xs:enumeration value="ULP"/>
 <xs:enumeration value="NLF"/>
 <xs:enumeration value="APR"/>
 <xs:enumeration value="OMD"/>
 <xs:enumeration value="CBA"/>
 <xs:enumeration value="PEA"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="tran-purpose" minOccurs="0" maxOccurs="unbounded">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="A"/>
 <xs:enumeration value="B"/>
 <xs:enumeration value="C"/>
 <xs:enumeration value="E"/>
 <xs:enumeration value="F"/>
 <xs:enumeration value="G"/>
 <xs:enumeration value="H"/>
 <xs:enumeration value="I"/>
 <xs:enumeration value="L"/>
 <xs:enumeration value="M"/>
 <xs:enumeration value="N"/>
 <xs:enumeration value="O"/>
 <xs:enumeration value="P"/>
 <xs:enumeration value="R"/>
 <xs:enumeration value="S"/>
 <xs:enumeration value="T"/>
 <xs:enumeration value="U"/>
 <xs:enumeration value="W"/>
 <xs:enumeration value="X"/>
 <xs:enumeration value="Y"/>
 <xs:enumeration value="Z"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="description" minOccurs="0">
 <xs:annotation>
 <xs:documentation>A written description of the purpose of the
transaction.</xs:documentation>
</xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="200"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="amount">
 <xs:annotation>
 <xs:documentation>The dollar value of the transaction.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="aggregate-amount" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The total amount of contributions or expenditures for a contributor or
payee.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:decimal"/>
 </xs:simpleType>
 </xs:element>
 <xs:element name="payment-method" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The method in which payment was made.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="CHK"/>
 <xs:enumeration value="ACH"/>
 <xs:enumeration value="EFT"/>
 <xs:enumeration value="DC"/>
 <xs:enumeration value="CC"/>
 <xs:enumeration value="CA"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="date" type="xs:date">
 <xs:annotation>
 <xs:documentation>The date the transaction occurred. This is not the date the transaction
was entered into the system.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="check-no" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The number of the check.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:integer">
 <xs:maxInclusive value="999999999999"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="interest-rate" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The interest rate of the loan.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="payment-schedule" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The repayment schedule for the loan.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="occupation-letter-date" type="xs:date" minOccurs="0">
 <xs:annotation>
 <xs:documentation>The date a letter was sent requesting a contributor's occupational
information.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element name="notes" minOccurs="0">
 <xs:annotation>
 <xs:documentation>Additional information about the transaction.</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="1000"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="cosigner" minOccurs="0" maxOccurs="unbounded">
 <xs:annotation>
 <xs:documentation>A person who guarantees a laon of monetary value and is considered
a contributor until the loan is paid.</xs:documentation>
 </xs:annotation>
 </xs:element>
 <xs:element ref="expend-for" minOccurs="0" maxOccurs="unbounded"/>
 <xs:element ref="associated-tran" minOccurs="0" maxOccurs="unbounded">
 <xs:annotation>
 <xs:documentation>Identifies all transactions that are associated with this transaction and
if the association completes the original transaction.</xs:documentation>
 </xs:annotation>
 </xs:element>
 </xs:sequence>
 <xs:attribute name="id" use="required">
 <xs:annotation>
 <xs:documentation>vendor transaction id. This is the Uique ID for the
transaction</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="1"/>
 <xs:maxLength value="30"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:attribute>
 </xs:complexType>
</xs:element>`;

export const phoneXSD = `<xs:element name="phone">
<xs:annotation>
<xs:documentation>This is the phone number for the contact</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:sequence>
<xs:element name="work" minOccurs="0">
<xs:annotation>
 <xs:documentation>the format was \d{3}-\d{3}-\d{4}(\sExt\s[0-
9999999])?</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="10"/>
 <xs:maxLength value="15"/>
 <xs:whiteSpace value="collapse"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="work-extension" minOccurs="0">
 <xs:annotation>
 <xs:documentation>This is the extension number for the work phone</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="5"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="home" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="10"/>
 <xs:maxLength value="15"/>
 <xs:whiteSpace value="collapse"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="fax" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:minLength value="10"/>
 <xs:maxLength value="15"/>
 <xs:whiteSpace value="collapse"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:complexType>
</xs:element>`;

export const cosignerXSD = `<xs:element name="cosigner">
<xs:complexType>
<xs:sequence>
<xs:element name="contact-id">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:minLength value="1"/>
<xs:maxLength value="30"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element ref="amount"/>
</xs:sequence>
</xs:complexType>
</xs:element>`;

export const expendForXSD = `<xs:element name="expend-for">
<xs:complexType>
<xs:sequence>
<xs:choice>
<xs:element name="committee-id" type="xs:positiveInteger"/>
<xs:element name="committee-name">
<xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:maxLength value="80"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:choice>
 <xs:element name="committee-type" default="C" minOccurs="0">
 <xs:annotation>
 <xs:documentation>committee-type values are C = Committee (default), M = Measure, R =
Recall</xs:documentation>
 </xs:annotation>
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="C"/>
 <xs:enumeration value="M"/>
 <xs:enumeration value="R"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element ref="amount"/>
 <xs:element name="expend-ind">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="I"/>
 <xs:enumeration value="K"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 <xs:element name="support-ind" minOccurs="0">
 <xs:simpleType>
 <xs:restriction base="xs:string">
 <xs:enumeration value="Y"/>
 <xs:enumeration value="N"/>
 </xs:restriction>
 </xs:simpleType>
 </xs:element>
 </xs:sequence>
 </xs:complexType>
</xs:element>`;

export const individualNameXSD = `<xs:element name="individual-name">
<xs:complexType>
<xs:sequence>
<xs:element name="prefix" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="3"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="first">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="20"/>
</xs:restriction>
</xs:simpleType>
</xs:element><xs:element name="middle" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="20"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="last">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="20"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="suffix" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="3"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
<xs:element name="title" minOccurs="0">
<xs:annotation>
<xs:documentation>The contacts working title</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="20"/>
</xs:restriction>
</xs:simpleType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>`;

// removed minOccurs="0" maxOccurs="unbounded">
export const tranPurposeXSD = `<xs:element name="tran-purpose">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:enumeration value="A"/>
<xs:enumeration value="B"/>
<xs:enumeration value="C"/>
<xs:enumeration value="E"/>
<xs:enumeration value="F"/>
<xs:enumeration value="G"/>
<xs:enumeration value="H"/>
<xs:enumeration value="I"/>
<xs:enumeration value="L"/>
<xs:enumeration value="M"/>
<xs:enumeration value="N"/>
<xs:enumeration value="O"/>
<xs:enumeration value="P"/>
<xs:enumeration value="R"/>
<xs:enumeration value="S"/>
<xs:enumeration value="T"/>
<xs:enumeration value="U"/>
<xs:enumeration value="W"/>
<xs:enumeration value="X"/>
<xs:enumeration value="Y"/>
<xs:enumeration value="Z"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

// remove minOccurs="0"
export const transactionDescriptionXSD = `<xs:element name="description">
<xs:annotation>
<xs:documentation>A written description of the purpose of the
transaction.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="200"/>
 </xs:restriction>
 </xs:simpleType>
</xs:element>`;

// removed minOccurs="0"
export const aggregateAmountXSD = `<xs:element name="aggregate-amount">
<xs:annotation>
<xs:documentation>The total amount of contributions or expenditures for a contributor or
payee.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:decimal"/>
</xs:simpleType>
</xs:element>`;

// removed minOccurs="0"
export const paymentMethodXSD = `<xs:element name="payment-method">
<xs:annotation>
<xs:documentation>The method in which payment was made.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:enumeration value="CHK"/>
<xs:enumeration value="ACH"/>
<xs:enumeration value="EFT"/>
<xs:enumeration value="DC"/>
<xs:enumeration value="CC"/>
<xs:enumeration value="CA"/>
</xs:restriction>
 </xs:simpleType>
</xs:element>`;

export const dateXSD = `<xs:element name="date" type="xs:date">
<xs:annotation>
<xs:documentation>The date the transaction occurred. This is not the date the transaction
was entered into the system.</xs:documentation>
</xs:annotation>
</xs:element>`;

// minOccurs="0"
export const checkNoXSD = `<xs:element name="check-no">
<xs:annotation>
<xs:documentation>The number of the check.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:integer">
<xs:maxInclusive value="999999999999"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

// removed minOccurs="0"
export const interestRateXSD = ` <xs:element name="interest-rate">
<xs:annotation>
<xs:documentation>The interest rate of the loan.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="30"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

//removed minOccurs="0"
export const paymentScheduleXSD = `<xs:element name="payment-schedule">
<xs:annotation>
<xs:documentation>The repayment schedule for the loan.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="30"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

// removed minOccurs="0"
export const occupationLetterDateXSD = `<xs:element name="occupation-letter-date" type="xs:date">
<xs:annotation>
<xs:documentation>The date a letter was sent requesting a contributor's occupational
information.</xs:documentation>
</xs:annotation>
</xs:element>`;

// removed minOccurs="0"
export const transactionNotesXSD = `<xs:element name="notes">
<xs:annotation>
<xs:documentation>Additional information about the transaction.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:maxLength value="1000"/>
</xs:restriction>
</xs:simpleType>
</xs:element>`;

export const street1Schema = xmlWrapper(street1XSD);
export const street2Schema = xmlWrapper(street2XSD);
export const citySchema = xmlWrapper(cityXSD);
export const stateSchema = xmlWrapper(stateXSD);
export const zipSchema = xmlWrapper(zipXSD);
export const zipPlusFourSchema = xmlWrapper(zipPlusFourXSD);
export const fgnPostCodeSchema = xmlWrapper(fgnPostCodeXSD);
export const countryCodeSchema = xmlWrapper(countryCodeXSD);
export const countySchema = xmlWrapper(countyXSD);
export const amountSchema = xmlWrapper(amountXSD);
export const associatedTranSchema = xmlWrapper(associatedTranXSD);
export const associatedIdSchema = xmlWrapper(associatedIdXSD);
export const associatedCompleteSchema = xmlWrapper(associatedCompleteXSD);
export const campaignFinanceTransactionsSchema = xmlWrapper(
  campaignFinanceTransactionsXSD,
  contactXSD,
  employmentXSD,
  transactionXSD,
  contactNameXSD,
  addressXSD,
  phoneXSD,
  amountXSD,
  cosignerXSD,
  expendForXSD,
  associatedTranXSD
  );
export const contactSchema = xmlWrapper(
  contactXSD,
  contactNameXSD,
  phoneXSD,
  addressXSD,
  employmentXSD
);
export const contactOccupationSchema = xmlWrapper(contactOccupationXSD);
export const contactIdSchema = xmlWrapper(contactIdXSD);
export const contactTypeSchema = xmlWrapper(contactTypeXSD);
export const contactNameSchema = xmlWrapper(contactNameXSD);
export const contactBusinessNameSchema = xmlWrapper(contactBusinessNameXSD);
export const contactNameCommitteeSchema = xmlWrapper(contactNameCommitteeXSD);
export const cosignerSchema = xmlWrapper(cosignerXSD, amountXSD);
export const employmentSchema = xmlWrapper(employmentXSD);
export const expendForSchema = xmlWrapper(expendForXSD, amountXSD);
export const individualNameSchema = xmlWrapper(individualNameXSD);
export const phoneSchema = xmlWrapper(phoneXSD);
export const transactionSchema = xmlWrapper(
  transactionXSD,
  amountXSD,
  cosignerXSD,
  expendForXSD,
  associatedTranXSD
);
export const tranPurposeSchema = xmlWrapper(tranPurposeXSD);
export const transactionDescriptionSchema = xmlWrapper(transactionDescriptionXSD);
export const aggregateAmountSchema = xmlWrapper(aggregateAmountXSD);
export const paymentMethodSchema = xmlWrapper(paymentMethodXSD);
export const dateSchema = xmlWrapper(dateXSD);
export const checkNoSchema = xmlWrapper(checkNoXSD);
export const interestRateSchema = xmlWrapper(interestRateXSD);
export const paymentScheduleSchema = xmlWrapper(paymentScheduleXSD);
export const occupationLetterDateSchema = xmlWrapper(occupationLetterDateXSD);
export const transactionNotesSchema = xmlWrapper(transactionNotesXSD);