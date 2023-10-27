import store from "../redux/store/app";
import {
	declare_variable,
	print_to_screen,
	variable_assignment,
} from "./functions";
import {
	IInterpreterSlice,
	move_program_counter,
} from "@/redux/reducers/interpreter";

interface token_info {
	type: "keyword" | "identifier" | "operation";
	name: string;
}

type pseudo_actions = "output" | "input" | "variable" | "assignment" | "";

export interface CommandI {
	operation: pseudo_actions;
	args: string;
	line: number;
}

export type data_type_t =
	| "integer"
	| "string"
	| "double"
	| "float"
	| "bool"
	| "boolean"
	| "char";

export const pseudo_data_type: data_type_t[] = [
	"integer",
	"string",
	"double",
	"float",
	"bool",
	"boolean",
	"char",
];

export const identifier_regex = /^[a-zA-Z_]\w*$/;
export const number_regex = /[+-]?\d+(\.\d+)?/g;
export const integer_regex = /^-?\d+$/;
export const float_regex = /-?\d+\.\d+$/;
export const string_regex = /(['"])(.*?)\1$/;
export const comma_regex =
	/,\s*(?=(?:(?:[^"]*"){2})*[^"]*$)(?=(?:(?:[^']*'){2})*[^']*$)/;

export interface VariableI {
	readonly name: string;
	value: any;
	type: data_type_t;
	scope?: string;
}

export const pseudo_keywords = [
	"input",
	"read",
	"get",
	"accept",
	"write",
	"print",
	"show",
	"output",
	"display",
	"if",
	"endif",
	"then",
	"else",
	"is",
	"true",
	"false",
	"for",
	"to",
	"step",
	"endfor",
	"while",
	"endwhile",
	"declare",
	"as",
	"do",
	"repeat",
	"until",
	...pseudo_data_type,
];

export const pseudo_keyword_type = {
	output: ["write", "output", "display", "show", "print"],
	input: ["input", "read", "accept", "get"],
	variable: ["declare"],
};

export function execute_instructions() {
	const program_counter = store.getState().interpreter.program_counter;
	const executables = store.getState().interpreter.executable;

	if (program_counter >= executables.length) return;

	const command = executables[program_counter];
	store.dispatch(move_program_counter(program_counter + 1));
	select_function(command.operation, command.args);

	// console.log(command);

	execute_instructions();
}

export function idenitfy_token(token: string): token_info | null {
	//check if token is a keyword
	if (pseudo_keywords.includes(token.toLowerCase())) {
		return { name: token, type: "keyword" };
	} else if (identifier_regex.test(token)) {
		return { name: token, type: "identifier" };
	}

	return null;
}

export function get_keyword_type(token: string): pseudo_actions {
	if (pseudo_keyword_type.output.includes(token.toLowerCase())) return "output";
	else if (pseudo_keyword_type.input.includes(token.toLowerCase()))
		return "input";
	else if (pseudo_keyword_type.variable.includes(token.toLowerCase()))
		return "variable";

	return "";
}

export function select_function(action: pseudo_actions, args: string) {
	switch (action) {
		case "output":
			print_to_screen(args);
			break;
		case "input":
			break;
		case "variable":
			declare_variable(args);
			break;
		case "assignment":
			variable_assignment(args);
			break;
		case "":
			break;
		default:
			console.log("Nothing changed");
			break;
	}
}