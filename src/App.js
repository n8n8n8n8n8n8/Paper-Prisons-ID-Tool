import React, { useEffect, useState } from "react";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import Form from "./components/Form";
import "./styles.css";

export default function App() {
  const questions = [
    {
      id: "q1",
      title:
        "Proof of Residency: Please select if you have any of the following",
      type: "radio",
      options: [
        {
          title:
            "Sinstitution or entity that has issued a credit card (Credit card bills, proof of a bank account, loan reciepts)",
          options: [
            "Medical documents (yearly check up documents or dentist records)",
            "Employment documents (W2 or 1099 Tax Forms)"
          ]
        },

        {
          title:
            "institution or entity that has issued a credit card (Credit card bills, proof of a bank account, loan reciepts)",
          options: [
            "Voter registration confirmation letter or postcard issued by the California Secretary of State or a local California county elections officer",
            "Proof of payment of resident tuition at a public institution of higher education in California Community College or 4 Year University both work)"
          ]
        }
      ]
    },
    {
      id: "q2",
      title:
        "Proof of Identity: Please select if you have any of the following",
      type: "radio",
      options: [
        "U.S. passport.",
        "U.S. certificate of birth abroad.",
        "U.S. military DD-214."
      ]
    },
    {
      id: "q3",
      title:
        "Proof of Identity: Please select if you have any of the following",
      type: "radio",
      options: [
        "U.S. passport.",
        "U.S. certificate of birth abroad.",
        "U.S. military DD-214."
      ]
    },
    {
      id: "q4",
      title:
        "Proof of Identity: Please select if you have any of the following",
      type: "dropdown",
      options: [
        "U.S. passport.",
        "U.S. certificate of birth abroad.",
        "U.S. military DD-214.",
        "U.S. certificate of birth abroad. 2",
        "U.S. military DD-214. 2",
        "U.S. certificate of birth abroad. 3",
        "U.S. military DD-214. 3",
        "U.S. certificate of birth abroad. 4",
        "U.S. military DD-214. 4"
      ]
    }
  ];
  const [dynamicQuestions, setDynamicQuestions] = useState({});
  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 4));
  };

  // https://docs.google.com/spreadsheets/d/1S9Ac06eAesmc4J8mgEdO6A083H2sfkPKEk7sbg3USGY/edit#gid=0
  useEffect(() => {
    const parser = new PublicGoogleSheetsParser();
    parser
      .parse("1S9Ac06eAesmc4J8mgEdO6A083H2sfkPKEk7sbg3USGY", "Customized")
      .then((items) => {
        setDynamicQuestions(
          items.reduce((acc, item) => {
            if (acc[item.id]) {
              acc[item.id].options.push({
                title: item.title,
                options: Object.keys(item)
                  .filter(
                    (item) => ["title", "type", "id"].indexOf(item) === -1
                  )
                  .map((key) => item[key])
                  .filter((item) => !!item.trim())
              });
            } else {
              acc[item.id] = {
                type: item.type,
                id: item.id,
                title: item.title,
                options: Object.keys(item)
                  .filter(
                    (item) => ["title", "type", "id"].indexOf(item) === -1
                  )
                  .map((key) => item[key])
                  .filter((item) => !!item.trim())
              };
            }
            return acc;
          }, {})
        );
      });
  }, []);

  return (
    <>
      <h2>Sample</h2>
      <Form data={questions} onSubmit={onSubmit} />
      <hr />
      <h2>Data from excel</h2>
      <Form data={Object.values(dynamicQuestions)} onSubmit={onSubmit} />
    </>
  );
}
