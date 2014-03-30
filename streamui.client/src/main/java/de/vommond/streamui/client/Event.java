package de.vommond.streamui.client;


public class Event {

	private long id;
	
	private String server, component, instance, aspect;

	public Event(String server, String component, String instance, String aspect) {
		super();
		this.server = server;
		this.component = component;
		this.instance = instance;
		this.aspect = aspect;
	}

	public String getServer() {
		return server;
	}

	public String getComponent() {
		return component;
	}

	public String getInstance() {
		return instance;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAspect() {
		return aspect;
	}

	public void setAspect(String aspect) {
		this.aspect = aspect;
	}

	public void setServer(String server) {
		this.server = server;
	}

	public void setComponent(String component) {
		this.component = component;
	}

	public void setInstance(String instance) {
		this.instance = instance;
	}
	
	
	
}
