INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.1", "Financial instrument", "T", null, "NAME");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.2", "Address", "T", null, "ADDRESS");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.3", "Country of incorporation", "T", null, "COUNTRY");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.4", "Are you a regulated entity", "R", null, "REGULATED_ENTITY");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.4a", "If yes, what is your registration number / regulatory license?", "T", "1.4", "REGULATORY_LICENSE");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.4b", "If yes, what type of licenses do you hold? Please include the name of the regulator", "T", "1.4", "REGULATORY_LICENSE_TYPE");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.4c", "Does the firm’s regulatory structure cover anti–money laundering (AML) and counterterrorism financing (CTF)?", "R", "1.4", "REGULATORY_STRUCTURE_COVER_AML_CTF");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.4d", "If yes, are you a MiFID entity? (Applicable only when registered in EU / EEA.)", "R", "1.4", "MIFID_ENTITY");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.5", "Are you a wholly owned subsidiary of a regulated entity?", "R", null, "WHOLLY_OWNED_SUBSIDIARY");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.6", "List corporate events (mergers or acquisitions) over the past three years that are relevant to the investment fund distribution business.", "T", null, "CORPORATE_EVENTS");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.7", "Ultimate beneficial owner (UBO). Do you have any shareholder directly or indirectly owning 25 percent or more of the entity’s shares or exercising power or control through other means?", "R", null, "UBO");
INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("1.7a", "If yes, please list any natural persons that directly or indirectly hold 25 percent or more of the shares / voting rights of your firm’s shares", "T", "1.7", "UBO_LIST");
# INSERT INTO api_question (num_q, question, type, parent, alias) VALUES("", "", "T", null, "");

