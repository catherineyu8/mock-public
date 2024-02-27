import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import {
  mockLoadCSV,
  mode,
  REPLFunction,
  mockSearchCSV,
  mockViewCSV,
} from "./REPLFunction";
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

  const functions: Map<String, REPLFunction> = new Map();
  functions.set("load", mockLoadCSV);
  functions.set("view", mockViewCSV);
  functions.set("search", mockSearchCSV);
  functions.set("mode", mode);

  const handleSubmit = (commandString: string) => {
    setCount(count + 1); // TODO: remove

    const commandList = commandString.split(" ");
    let f = functions.get(commandList[0]);

    if (f != undefined) {
      // command exists
      const response = f(commandList.slice(1));
      // TODO: add history 2 ways depending on isBrief
      props.setHistory([
        ...props.historyList,
        {
          command: commandList[0],
          isBrief: props.modeIsBrief,
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
          isBrief: props.modeIsBrief,
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