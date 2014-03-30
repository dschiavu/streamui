package de.vommond.streamui.client;

public class ReceiveEvent extends Event {


	private long count;

	public ReceiveEvent(String server, String component, String instance,  String aspect, long count) {
		super(server, component, instance,aspect);
		this.count = count;
	}


	public long getCount() {
		return count;
	}


	public void setCount(long count) {
		this.count = count;
	}
}
