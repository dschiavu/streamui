package de.vommond.streamui.client;

public class BooleanEvent extends Event{
	
	private long trues, falses;

	public BooleanEvent(String server, String component, String instance, String aspect,	long trues, long falses) {
		super(server, component, instance,aspect);
		this.trues = trues;
		this.falses = falses;
	}

	public long getTrues() {
		return trues;
	}

	public long getFalses() {
		return falses;
	}

	public void setTrues(long trues) {
		this.trues = trues;
	}

	public void setFalses(long falses) {
		this.falses = falses;
	}

}
