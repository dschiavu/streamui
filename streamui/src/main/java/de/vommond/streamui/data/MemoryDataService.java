package de.vommond.streamui.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import de.vommond.streamui.client.Events;
import de.vommond.streamui.status.Event;

public abstract class MemoryDataService implements IDataService {

	public void close() throws IOException {
		// TODO Auto-generated method stub
		
	}

	public int save(Events e) {
		// TODO Auto-generated method stub
		return 0;
	}

	public int clear(String topology, long currentTimeMillis) {
		// TODO Auto-generated method stub
		return 0;
	}
	
}
