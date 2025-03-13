import { invoke } from '@tauri-apps/api/core';

export const preventDefault = <T extends Event>(fn: (e: T) => void): ((e: T) => void) => {
	return (e: T) => {
		e.preventDefault();
		fn(e);
	};
};

export class GlobalState {
	private _state = $state({ prompt: '' });
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

	// async submit() {
	// 	this.greet = await invoke('greet', { name: this.prompt });
	// }

	reset() {
		this.prompt = '';
	}
}
