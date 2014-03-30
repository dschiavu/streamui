package de.vommond.streamui;

import java.util.List;

public class Topology {
	
	private String id;
	
	private String type;
	
	private List<Component> components;
	
	private TopologyLayout layout;
	
	private long events = 0;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Component> getComponents() {
		return components;
	}

	public void setComponents(List<Component> components) {
		this.components = components;
	}

	public long getEvents() {
		return events;
	}

	public void setEvents(long events) {
		this.events = events;
	}

	public TopologyLayout getLayout() {
		return layout;
	}

	public void setLayout(TopologyLayout layout) {
		this.layout = layout;
	}
	
	
}
