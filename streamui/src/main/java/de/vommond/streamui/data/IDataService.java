package de.vommond.streamui.data;

import java.io.Closeable;
import java.util.Collection;
import java.util.Map;

import de.vommond.streamui.client.Events;
import de.vommond.streamui.status.TopologyStatus;

public interface IDataService extends Closeable {
	
	public int save(Events e);

	public int clear(String topology, long currentTimeMillis);

	public Collection<String> getServer(String string, int millis);
	
	public Collection<String> getComponents(String topology, int millis);
	
	public Collection<String> getInstances(String topology, int millis);

	public TopologyStatus getInstanceStatus(String topology, long from,long to);
	
	public TopologyStatus getComponentStatus(String topology, long from,long to);

	public Map<String, Long> getEventStatistics(String id);

}
