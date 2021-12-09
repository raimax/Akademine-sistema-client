import React, { useEffect, useState } from "react";

interface ISidebarButton {
	content: string
	active: boolean
	id: string
	onClick: any
}

const SidebarButton = ({ content, active, id, onClick }: ISidebarButton) => {
	const [activeButton, setActiveButton] = useState<boolean | null>(null);

	useEffect(() => {
		if (active) {
			setActiveButton(true);
		}
		else {
			setActiveButton(false);
		}
	}, [active, setActiveButton]);

	return (
		<button id={id} onClick={onClick} className={`sidebar-button ${activeButton ? 'activeSidebarButton' : ''}`}>
			<div>
				{content}
			</div>
		</button>
	)
}

export default SidebarButton
