package de.vommond.streamui;

import java.util.List;

public class Component {
	
	private String id;
	
	private String type;
	
	private List<String> sources;
	

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

	public List<String> getSources() {
		return sources;
	}

	public void setSources(List<String> sources) {
		this.sources = sources;
	}



}
