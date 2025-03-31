import { invoke } from '@tauri-apps/api/core';

export const preventDefault = <T extends Event>(fn: (e: T) => void): ((e: T) => void) => {
	return (e: T) => {
		e.preventDefault();
		fn(e);
	};
};

export class GlobalState {
	private _state = $state({
		prompt: '',
		selectedConfig: '',
		selectedConfigDirectory: '',
		yamlContent: ''
	});
	public isVoiceInput = $state(false);

	get prompt() {
		return this._state.prompt;
	}
	set prompt(value: string) {
		this._state.prompt = value;
	}
	get nlen() {
		return this.prompt.length;
	}
	get selectedConfig() {
		return this._state.selectedConfig;
	}
	set selectedConfig(value: string) {
		this._state.selectedConfig = value;
	}
	get selectedConfigDirectory() {
		return this._state.selectedConfigDirectory;
	}
	set selectedConfigDirectory(value: string) {
		this._state.selectedConfigDirectory = value;
	}
	get yamlContent() {
		return this._state.yamlContent;
	}
	set yamlContent(value: string) {
		this._state.yamlContent = value;
	}

	// async submit() {
	// 	this.greet = await invoke('greet', { name: this.prompt });
	// }
	async submit() {
		// submission logic here
	}

	reset() {
		this.prompt = '';
		this.selectedConfig = '';
		this.selectedConfigDirectory = '';
	}
}
