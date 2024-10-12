export default class DOM {
	static quitarFocusBotonCerrarElDialog() {
		const botonesCerrar = <NodeListOf<HTMLButtonElement> | null>document.querySelectorAll(".el-dialog__headerbtn");
		if (!!botonesCerrar) {
			Array.from(botonesCerrar).forEach((closeButton) => {
				closeButton.setAttribute("tabindex", "-1");
			});
		}
	}
}
