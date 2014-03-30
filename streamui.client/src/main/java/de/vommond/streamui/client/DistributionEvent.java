package de.vommond.streamui.client;

import java.util.HashMap;

public class DistributionEvent extends Event{

	private HashMap<Double, Long> distribution;

	public DistributionEvent(String server, String component, String instance,
			String aspect, HashMap<Double, Long> distribution) {
		super(server, component, instance, aspect);
		this.distribution = distribution;
	}

	public HashMap<Double, Long> getDistribution() {
		return distribution;
	}

	public void setDistribution(HashMap<Double, Long> distribution) {
		this.distribution = distribution;
	}
	
	
}
