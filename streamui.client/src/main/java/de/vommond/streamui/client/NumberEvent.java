package de.vommond.streamui.client;

public class NumberEvent extends Event{
	
	private long count;
	
	private double value;

	public NumberEvent(String server, String component, String instance,  String aspect,double value, long count) {
		super(server, component, instance, aspect);
		this.count = count;
		this.value = value;
	}

	public long getCount() {
		return count;
	}

	public double getValue() {
		return value;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public void setValue(double value) {
		this.value = value;
	}

	

	

}
