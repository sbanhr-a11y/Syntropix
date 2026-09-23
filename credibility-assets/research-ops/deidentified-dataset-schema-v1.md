# De-identified Validation Dataset Schema — v1

Status: TEMPLATE  
Purpose: minimum analysis-ready structure for assessment validation studies.

## Principles

- Keep directly identifying contact fields out of the analysis dataset.
- Use a random study participant ID; do not derive IDs from email, phone, employee number or name.
- Store any contact/re-identification table separately with stricter access and shorter retention.
- Collect only demographics/context variables justified by the protocol.
- Preserve exact instrument/scoring/version identifiers on every response record.
- Never mix responses from materially different instrument versions without an explicit comparability decision.

## Recommended tables

### participants_analysis

| field | type | required | notes |
|---|---|---:|---|
| study_participant_id | string | yes | random study identifier |
| study_id | string | yes | preregistered study |
| instrument_name | string | yes | canonical name |
| instrument_version | string | yes | semantic version |
| scoring_version | string | yes | exact scoring version |
| locale | string | yes | administration locale |
| administration_mode | string | yes | web / supervised / other |
| consent_version | string | yes | consent artefact version |
| consent_timestamp | datetime | yes | study-system timestamp |
| completion_timestamp | datetime | yes | |
| age_band | category | protocol-dependent | prefer bands unless exact age is necessary |
| geography_band | category | protocol-dependent | collect only level required for analysis |
| role_level | category | protocol-dependent | |
| industry_band | category | protocol-dependent | |
| fairness_group_* | category | protocol-dependent | only justified fields |
| inclusion_flag | boolean | yes | final analysis inclusion |
| exclusion_reason | string | if excluded | coded reason |

### item_responses

| field | type | required |
|---|---|---:|
| study_participant_id | string | yes |
| instrument_version | string | yes |
| item_lineage_id | string | yes |
| displayed_item_number | integer | yes |
| dimension_key | string | yes |
| raw_response | integer | yes |
| reverse_keyed | boolean | yes |
| transformed_response | numeric | yes |
| response_timestamp | datetime | optional |
| response_time_ms | integer | optional / only if disclosed and justified |

### scores

| field | type | required |
|---|---|---:|
| study_participant_id | string | yes |
| instrument_version | string | yes |
| scoring_version | string | yes |
| score_key | string | yes |
| score_value | numeric | yes |
| score_scale | string | yes |
| calculation_commit | string | yes |

### retest_link

Use only when the protocol requires longitudinal/test–retest linkage.

| field | type | required |
|---|---|---:|
| study_participant_id | string | yes |
| wave | string | yes |
| administration_date | date | yes |

## Prohibited analysis-dataset fields by default

Do not include by default:
- name;
- email;
- phone;
- street address;
- exact employer identifiers where unnecessary;
- free-text notes containing identifiers;
- authentication tokens;
- IP address;
- device fingerprint;
- payment identifiers.

If a study truly requires a higher-risk field, document purpose, access, retention and minimisation explicitly.

## Versioning

Raw data: immutable after ingestion except documented correction.  
Cleaned data: versioned transformation output.  
Analysis-ready data: exact version tied to analysis commit.

Recommended naming:
`SX-DATA-[INSTRUMENT]-[VERSION]-[YYYY]-[NN]`.
