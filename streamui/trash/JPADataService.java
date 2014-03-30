package de.vommond.streamui.data;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import de.vommond.streamui.client.Events;
import de.vommond.util.Logger;

public class JPADataService implements IDataService{

	private EntityManagerFactory fac;
	
	private EntityManager man;
	
	private final String location;
	
	public JPADataService(String location){
		this.location = location;
	}

	public void close() {
	
		fac.close();
		
		man.close();
		
	}

	public void save(Events e) {
	
		
		EntityManager manager = getEntityManager(e.getTopology());
		
	}

	private EntityManager getEntityManager(String topology) {
		Logger.info(this.getClass(), "init", "enter");
		
		if(this.man == null){	
			String url = "jdbc:h2:~"+this.location + "/"+topology;
			EntityManagerFactory fac = createEntityManagerFactory(url);
			this.man =  fac.createEntityManager();
		}
		 
		return man;
	  
	}

	
	protected EntityManagerFactory createEntityManagerFactory(String URL) {
		Logger.info(this.getClass(), "createEntityManagerFactory", "Connected to " + URL);
		try {
		
				Map<String, String> properties = new HashMap<String, String>();
				properties.put("javax.persistence.jdbc.url", URL);
				properties.put("javax.persistence.jdbc.user", "");
				properties.put("javax.persistence.jdbc.password", "");
//				properties.put("eclipselink.ddl-generation.output-mode", "database");
//				properties.put("eclipselink.jdbc.batch-writing", "JDBC");
//				properties.put("eclipselink.jdbc.uppercase-columns", "true");
//				properties.put("eclipselink.logging.level", "WARNING");
//				properties.put("eclipselink.ddl-generation", "create-tables"); 

				EntityManagerFactory emf = Persistence.createEntityManagerFactory("StreamUI",	properties);
				return emf;
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
}
