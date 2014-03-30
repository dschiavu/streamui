package de.vommond.streamui.client;

public class EmitEvent extends Event {


	private long count;

	public EmitEvent(String server, String component, String instance,  String aspect, long cont) {
		super(server, component, instance,aspect);
		this.count = cont;
	}


	public long getCount() {
		return count;
	}


	public void setCount(long count) {
		this.count = count;
	}
}
