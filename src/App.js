import React, { useEffect, useState } from "react";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import Form from "./components/Form";
import "./styles.css";

function linkify(text) {
  let urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  return text.replace(urlPattern, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

export default function App() {
  const [dynamicQuestions, setDynamicQuestions] = useState({});
  const [questionFlow, setQuestionFlow] = useState({});
  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 4));
  };

  // https://docs.google.com/spreadsheets/d/1ZT-W11ArW9eihPW38Ui4A9F3x6HpRogGiktmskcqkCo/edit#gid=0
  useEffect(() => {
    const parser = new PublicGoogleSheetsParser();
    const tempFlow = { prev: {}, next: {} };
    parser
      // .parse("1ZT-W11ArW9eihPW38Ui4A9F3x6HpRogGiktmskcqkCo", "Customized")
      // .parse("1S9Ac06eAesmc4J8mgEdO6A083H2sfkPKEk7sbg3USGY", "CA")
      .parse("1S9Ac06eAesmc4J8mgEdO6A083H2sfkPKEk7sbg3USGY", "CA2")
      .then((items) => {
        const temp = items
          .map((item) => {
            const temp = Object.keys(item)
              .filter((i) => ["title", "type", "id"].indexOf(i) === -1)
              .reduce((acc, i, ikey) => {
                const [q, nextQ] = item[i].split("$$$");
                acc[i] = q;
                if (!acc.next) {
                  acc.next = {};
                }
                if (!tempFlow.next[item.id]) {
                  tempFlow.next[item.id] = {};
                }
                tempFlow.next[item.id][q] = nextQ;
                tempFlow.prev[nextQ] = item.id;
                return acc;
              }, {});
            return { ...item, ...temp };
          })
          .reduce((acc, item) => {
            if (acc[item.id]) {
              acc[item.id].options.push({
                title: item.title,
                next: item.next,
                options: Object.keys(item)
                  .filter(
                    (item) =>
                      ["title", "type", "id", "next"].indexOf(item) === -1
                  )
                  .map((key) => item[key])
                  .filter((item) => !!item.trim())
              });
            } else {
              acc[item.id] = {
                type: item.type,
                id: item.id,
                title: item.title,
                next: item.next,
                options: Object.keys(item)
                  .filter(
                    (item) =>
                      ["title", "type", "id", "next"].indexOf(item) === -1
                  )
                  .map((key) => item[key])
                  .filter((item) => !!item.trim())
                  .map((item) => {
                    return linkify(item);
                  })
              };
            }
            return acc;
          }, {});

        setDynamicQuestions(temp);
        setQuestionFlow(tempFlow);
      });
  }, []);

  return (
    <>
      <Form
        data={Object.values(dynamicQuestions)}
        onSubmit={onSubmit}
        questionFlow={questionFlow}
      />
    </>
  );
}
