package de.vommond.streamui.client;

public class TimeEvent extends Event{
	
	private long nanos, count;

	public TimeEvent(String server, String component, String instance,  String aspect,long nanos, long count) {
		super(server, component, instance, aspect);
		this.nanos = nanos;
		this.count = count;
	}

	public long getNanos() {
		return nanos;
	}

	public long getCount() {
		return count;
	}

	public void setNanos(long nanos) {
		this.nanos = nanos;
	}

	public void setCount(long count) {
		this.count = count;
	}

}
