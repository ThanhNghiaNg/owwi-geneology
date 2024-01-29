import React, { useEffect, useState } from "react";
import classes from "./Pippip.module.css";
import Button from "./components/Button/Button";
import { convertCamelToTitleCase } from "./utils";
import Paragraph from "./components/Paragraph/Paragraph";
function Pippip(props) {
  const [data, setData] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [temp, setTemp] = useState(null);

  const addDataHandler = (type) => {
    setData((prev) => {
      const updated = [...prev];
      updated.push({
        id: new Date().getTime(),
        type,
        properties:
          type === "Button"
            ? { text: "Button", alertMessage: "" }
            : { text: "Paragraph" },
        onSelect: (id) => setSelectedComponent(id),
      });
      return updated;
    });
  };

  const updateDataHander = (id, propertiesName, value) => {
    setData((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.id === id);
      updated[index].properties[propertiesName] = value;
      return updated;
    });
  };

  const onSave = () => {
    localStorage.setItem(
      "data",
      JSON.stringify(
        data.map((item) => ({ ...item, onSelect: item.onSelect.toString() }))
      )
    );
  };

  localStorage.setItem("editMode", "true");

  useEffect(() => {
    const loadedData = localStorage.getItem("data");
    if (loadedData) {
      const formattedData = JSON.parse(loadedData).map((item) => {
        return {
          ...item,
          // onSelect: new Function(item.onSelect),
          onSelect: eval("(" + item.onSelect + ")"),
        };
      });
      console.log({ formattedData });
      setData(formattedData);
    }
  }, []);

  // console.log({ data });
  const selectedData = data.find((item) => item.id === selectedComponent);
  return (
    <div>
      <div className={classes.layout}>
        <div className={classes.actions_group}>
          <button onClick={onSave}>Save</button>
          <button>Undo</button>
          <button>Redo</button>
          <button>Export</button>
          <button>Import</button>
          <button>View</button>
        </div>
        <div className={classes.content}>
          <div className={classes.components_group}>
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("type", "paragraph");
                setTemp({ show: false, label: "paragraph" });
              }}
              onDragEnd={(e) => {
                e.dataTransfer.clearData("type");
                setTemp(null);
              }}
            >
              Paragraph View
            </div>
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("type", "button");
                setTemp({ show: false, label: "button" });
              }}
              onDragEnd={(e) => {
                e.dataTransfer.clearData("type");
                setTemp(null);
              }}
              onDragCapture={(e) => {
                console.log(e.screenX.toString());
              }}
            >
              Button View
            </div>
          </div>
          <div className={classes.main_content}>
            <div
              className={classes.view_area_group}
              onDragOver={(e) => {
                e.preventDefault();
                setTemp((prev) => {
                  const updated = { ...prev };
                  updated.show = true;
                  return updated;
                });
              }}
              onDragLeave={() => {
                setTemp((prev) => {
                  const updated = { ...prev };
                  updated.show = false;
                  return updated;
                });
              }}
              // onDragEnter={() => {
              //   setTemp((prev) => {
              //     const updated = { ...prev };
              //     updated.show = true;
              //     return updated;
              //   });
              // }}
              // onMouseOut={() => {
              //   console.log("haha");
              //   setTemp((prev) => {
              //     const updated = { ...prev };
              //     updated.show = false;
              //     return updated;
              //   });
              // }}
              onDrop={(e) => {
                addDataHandler(e.dataTransfer.getData("type"));
              }}
              // onDragExit={(e) => {
              //   setData((prev) => {
              //     return prev.slice(0, prev.length - 1);
              //   });
              // }}
            >
              {data.map((item) => {
                if (item.type === "button") {
                  return (
                    <Button
                      key={item.id}
                      id={item.id}
                      text={item.properties.text}
                      alertMessage={item.alertMessage}
                      onSelect={item.onSelect}
                    />
                  );
                }
                if (item.type === "paragraph") {
                  return (
                    <Paragraph
                      id={item.id}
                      key={item.id}
                      text={item.properties.text}
                      onSelect={item.onSelect}
                    />
                  );
                }
                return null;
              })}
              {temp && (
                <div className={temp.show ? classes.fade : classes.hide}>
                  {temp.label}
                </div>
              )}
            </div>
            <div className={classes.properties_group}>
              {selectedData &&
                Object.keys(selectedData.properties).map((prop) => {
                  console.log({
                    //prop,
                    selectedData,
                    props: selectedData.properties,
                    value: selectedData.properties[prop],
                  });
                  return (
                    <div key={`component-render-${selectedData.id}-${prop}`}>
                      <div>{convertCamelToTitleCase(prop)}</div>
                      <input
                        defaultValue={selectedData.properties[prop]}
                        onChange={(event) => {
                          updateDataHander(
                            selectedData.id,
                            prop,
                            event.target.value
                          );
                        }}
                      ></input>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pippip;
