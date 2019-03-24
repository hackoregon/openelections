### All tables

Required fields are the minimum number of fields required to **create the record** in the database. The application may require additional fields.

Fields denoted with an asterisk * are indexed.

required fields:
```
id* - UID - secure unique identifier - created in postgres. Do not use integer types.
createdAt - datetime stamp in UTC for record created
updatedAt - datetime stamp in UTC for last update. - Indexed
deletedAt - datetime stamp in UTC for deletion
```

### Government
Governments are entities that match donations, administer donation programs and possibly run elections.

**Table Name: Governments**

Required fields:
```
slug* - varchar(24) - unique indexed - the subdomain and humanreadable name 
for the government (i.e. portland, seattle). must be alphanumeric. 
will be used for folders & naming items in the system
```
Not Required
```
name - varchar(255) - the display name of the government program
website - varchar(255) - the government's main website for the matching program
domain - varchar(255) - the fully qualified domain name for the program (https://www.portlandopenelections.org)

```
### User
Users have access to the system, are linked to permissions and can add/edit/read data.

**Table name: Users**

Required Fields:
```
email* - varchar(255) - required - the email of the user
salt - varchar(255) - required - the application generated salt for the password
passwordHash - varchar(255) - required - the salted md5 hash of the password (salt + password)
```

Not Required Fields:
```
phone - uinteger(64) - the phone number of the user
firstName - varchar(255) - the user's first name
lastName - varchar(255) - the user's last name
address1 - varchar(255) - the mailing address
address2 - varchar(255) - the additional mailing address
city - varchar(255) - the city
state - varchar(255) - the two letter abbreviation
postcalCode - varchar(255) - the postal code - 5 to 8 numbers. dashes allowed
```

### Permissions

Permissions enable a user to conduct CRUD operations in the system. All permissions affect a resource which is a plain language name. These are enforced at the application level. All permission dictionaries should be maintained in the application code.

**Table name: Permissions**

Required fields
```
userId* - the user record - Indexed
permissionLevel - enum[create|update|read|delete]
resource* - enum[User|Donation|] - a human readable service or action identifier. Can correspond to the table name, a service, capability, etc. The dictionary is kept in the application.
governmentId* - the government id - if set, applies to all campaigns under the government
campaignId* - the campaign id - if set, applies to only the campaign
```
### Campaign

Campaigns are entities that will receive donation match funds. They submit donations and expenditures, and receive a matching donation. Campaigns are for ONE candidate running for office. A user can be connected to multiple campaigns.

Required Fields
```
Name - Campaign name
UserContactID - The user id who is the main treasury contact
```

Not Required Fields
```
FirstName - varchar(255) The first name of the person running for office
LastName - varchar(255) The last name of the person running for office
Office - varChar(255) The name of the office the individual is running for
ElectionCycleId - the id of the election cycle
```

### Election Cycle
An election cycle organizes campaigns, donations, expenditures into cyclical groups for easy reporting and visualizations.

Required Fields
```
governmentId*
name - varchar(255) - human readable and displayable name for the election cycle - i.e. Nov 12 2020.
status - enum[open|closed] - status for the campaign cycle. maybe contain more statuses
```

### Donor
Campaigns enter donor information. This in a unique record for each donation and will most likely be duplicated information (i.e. name, phone, email, etc).

### Donation
Campaigns enter donation information from a donor. Each donation is a unique record. Donations cannot be grouped.

### Donation Match
Each donation can be matched.

### Resident Record
A master table of residents from approved data sources. Resident records may be duplicated across data sources, (i.e. the same resident has an entry from two different data sources). A resident record may not be duplicated in a dataset.

### ResidentDonorMatch
A resident and a donor can be matched. This table records a history of matches (1 max per data source/resident)

### Donor Match Rule

### Expenditure
Campaigns enter expenditures. This is a unique record for each expenditure.

### Expenditure Match Rule

### Settings
Settings are undefined, added as needed, to customize the application and code for the government entity. Settings might include things like logos, colors, customized text, etc.

Required Fields
```
governmentId - record linkage to the government
key - varchar(255) - the setting key
value - blob - the binary or text blob. Can be json, binary (image), text, etc.
```
### Documents
