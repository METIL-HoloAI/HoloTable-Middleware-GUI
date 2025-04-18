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
		yamlContent: '',
		keywordDetected: false,
		isRecording: false,
		keyword: '',
		showRawYaml: false
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
	get keywordDetected() {
		return this._state.keywordDetected;
	}
	set keywordDetected(value: boolean) {
		this._state.keywordDetected = value;
	}
	get isRecording() {
		return this._state.isRecording;
	}
	set isRecording(value: boolean) {
		this._state.isRecording = value;
	}
	get keyword() {
		return this._state.keyword;
	}
	set keyword(value: string) {
		this._state.keyword = value;
	}
	get showRawYaml() {
		return this._state.showRawYaml;
	}
	set showRawYaml(value: boolean) {
		this._state.showRawYaml = value;
	}

	reset() {
		this.prompt = '';
		this.selectedConfig = '';
		this.selectedConfigDirectory = '';
	}
}
