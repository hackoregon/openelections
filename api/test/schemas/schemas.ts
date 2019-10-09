export const addressSchema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="address">
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
</xs:element></xs:schema>`;


//TODO: element zip should have attribute: minOccurs="0"
export const zipSchema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="zip">
<xs:simpleType>
<xs:restriction base="xs:integer">
<xs:totalDigits value="5"/>
<xs:pattern value="\d{5}"/>
</xs:restriction>
</xs:simpleType>
</xs:element></xs:schema>`;

//TODO: element state should have attribute: minOccurs="0"
export const stateSchema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="state">
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:length value="2"/>
</xs:restriction>
</xs:simpleType>
</xs:element></xs:schema>`;