import ReactDom from "react-dom";
import {App} from "./components/App";
import {BrowserRouter} from "react-router-dom";


const root = document.querySelector("#root");
ReactDom.render(<BrowserRouter><App/></BrowserRouter>, root);
