package de.vommond.streamui.client;

public class AcknowledgeEvent extends Event{
	
	private long timestamp;

	public AcknowledgeEvent(String server, String component, String instance,String aspect, long timestamp) {
		super(server, component, instance, aspect);
		this.timestamp = timestamp;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

}
