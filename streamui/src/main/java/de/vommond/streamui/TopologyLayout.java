package de.vommond.streamui;

import java.util.HashMap;

public class TopologyLayout {

	
	HashMap<String, ComponentLayout> components = new HashMap<String, ComponentLayout>();

	public HashMap<String, ComponentLayout> getComponents() {
		return components;
	}

	public void setComponents(HashMap<String, ComponentLayout> components) {
		this.components = components;
	}
}
