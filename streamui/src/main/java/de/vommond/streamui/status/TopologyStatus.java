package de.vommond.streamui.status;

import java.util.HashMap;

public class TopologyStatus {

	private String id;
	
	private long from, to;
	
	private HashMap<String, ComponentStatus> components = new HashMap<String, ComponentStatus>();
	
	private HashMap<String, InstanceStatus> instances = new HashMap<String, InstanceStatus>();
	
	public TopologyStatus(String id){
		this.id = id;
	}
	
	public InstanceStatus getInstance(String id){
		if(!this.instances.containsKey(id)){
			this.instances.put(id, new InstanceStatus(id));
		}
		return this.instances.get(id);
	}
	
	
	public ComponentStatus getComponent(String id){
		if(!this.components.containsKey(id)){
			this.components.put(id, new ComponentStatus(id));
		}
		return this.components.get(id);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public long getForm() {
		return from;
	}

	public void setFrom(long form) {
		this.from = form;
	}

	public long getTo() {
		return to;
	}

	public void setTo(long to) {
		this.to = to;
	}



}
