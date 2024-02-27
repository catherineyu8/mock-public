import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { mockLoadCSV, mode, mockSearchCSV, mockViewCSV } from "./REPLFunctions";
import { REPLFunction } from "./FunctionInterface";
import { Simulate } from "react-dom/test-utils";
import load = Simulate.load;
// import {REPLProps} from "./PropsInterface";

interface REPLProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  historyList: history[];
  setHistory: Dispatch<SetStateAction<history[]>>;
  modeIsBrief: boolean;
  setModeIsBrief: Dispatch<SetStateAction<boolean>>;
}

// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)
export function REPLInput(props: REPLProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  const cmdToFunc: Map<String, REPLFunction> = new Map();
  cmdToFunc.set("load", mockLoadCSV);
  cmdToFunc.set("view", mockViewCSV);
  cmdToFunc.set("search", mockSearchCSV);
  cmdToFunc.set("mode", mode);

  const handleSubmit = (commandString: string) => {
    setCount(count + 1); // TODO: remove

    const commandList = commandString.split(" ");
    let f = cmdToFunc.get(commandList[0]); // commandList[0] is the command

    if (f != undefined) {
      // command exists
      const response = f(commandList.slice(1));
      // TODO: add history 2 ways depending on isBrief
      props.setHistory([
        ...props.historyList,
        {
          command: commandList[0],
          isBrief: false, // TODO: implement mode props.modeIsBrief,
          response: response,
        },
      ]);
    } else {
      // command does not exist
      // TODO: add history 2 ways depending on isBrief
      props.setHistory([
        ...props.historyList,
        {
          command: commandList[0],
          isBrief: false, // TODO: implement mode props.modeIsBrief,
          response: "Error: command does not exist",
        },
      ]);
    }

    setCommandString("");
  };

  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      {/* TODO WITH TA: Build a handleSubmit function that increments count and displays the text in the button */}
      {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
      <button
        onClick={() => {
          handleSubmit(commandString);
        }}
      >
        Submitted {count} times
      </button>
    </div>
  );
}
