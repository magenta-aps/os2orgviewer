CHANGELOG
=========

3.17.0 - 2023-01-12
-------------------

[#54219] Filter out specific org_unit_levels

3.16.0 - 2023-01-10
-------------------

[#52341] Add phone number to search results

3.15.1 - 2022-12-22
-------------------

[#54127] Remove jq

3.15.0 - 2022-12-20
-------------------

[#54127] Hardcoded filter for Holstebro

3.14.1 - 2022-12-07
-------------------

[#54099] Use single quotes where ENV values may contain JSON

3.14.0 - 2022-12-06
-------------------

[#53767] Fix settings after linting broke them.

3.13.3 - 2022-12-02
-------------------

[#53767] Remove .trim()

3.13.2 - 2022-12-02
-------------------

[#53767] Add missing replace function

3.13.1 - 2022-12-02
-------------------

[#53767] Add trimming to avoid ignoring org_units with whitespaces

3.13.0 - 2022-11-29
-------------------

[#38329] Add Viborg CSS

3.12.0 - 2022-11-28
-------------------

[#53767] Remove _leder org_units

3.11.0 - 2022-11-23
-------------------

[#52814] Add work address in MED-organisation

3.10.0 - 2022-11-21
-------------------

[#53602] Bump graphql to v3

3.9.0 - 2022-11-15
------------------

[#51516] Hide org_units in tree

3.8.0 - 2022-11-14
------------------

[#51446] Bump Orgviewer to v2 graphql endpoint

3.7.0 - 2022-11-10
------------------

[#53521] Change Ballerup colors

3.6.0 - 2022-11-02
------------------

[#53281] Adds the option GLOBAL_ORG_UNIT_HIERARCHY_UUIDS to configure a list of org_unit_hierarchies to filter by, showing only organisationunits beloning to the specified hierarchies.

3.5.0 - 2022-10-27
------------------

[#53261] Add Ballerup CSS, add logic for calculating shades and make search icon bigger

3.4.1 - 2022-10-24
------------------

[#51884] Fix bug to allow showing vacant associations

3.4.0 - 2022-10-13
------------------

[#51382] Serve assets under a relative path
This enables the application to be served under a sub-path by the reverse-proxy

3.3.1 - 2022-10-13
------------------

[#51884] Fix bug where only associations with substitutes were shown.

3.3.0 - 2022-10-13
------------------

[#52873] Add CSS for Holstebro

3.2.0 - 2022-09-27
------------------

[#52685] Show dynamic classes and substitutes

3.1.0 - 2022-09-15
------------------

[#51382] Remove refresh recursion loop

3.0.0 - 2022-09-13
------------------

[#51382] Move Keycloak to frontend

2.7.0 - 2022-09-02
------------------

[#51382] Query `dynamic_class` instead of `dynamic_classes`

2.6.0 - 2022-09-01
------------------

[#52107] Refresh Keycloak token on restart

2.5.1 - 2022-06-15
------------------

[#50902] Crash less often due to Kubernetes CrashLoopBackoff issues

2.5.0 - 2022-06-09
------------------

[#50718] crash.sh more often

2.4.1 - 2022-05-25
------------------

[#49951] Fix orgviewer versioning

2.4.0 - 2022-05-20
------------------

[#49324] Styling for Silkeborg

2.3.1 - 2022-05-03
------------------

[#50058] Sleep for a random number of seconds before crashing

2.3.0 - 2022-04-26
------------------

[#49745] Allow setting keycloak client id

2.2.0 - 2022-04-22
------------------

[#49919] Crash

2.1.0 - 2022-04-04
------------------

[#47988] Run keycloak.sh on templated nginx conf

2.0.0 - 2022-04-04
------------------

[#47988] Replace SAML with Keycloak

1.0.3 - 2022-01-10
------------------

[#47157] Stylesheets for Hj??rring Kommune

1.0.2 - 2021-11-29
------------------

[#39266] Use updated CI templates

1.0.1 - 2021-11-23
------------------

[#39266] Fix CI release bug

1.0.0 - 2021-11-23
------------------

[#39266] Implement automatic versioning through autopub
