package de.vommond.streamui.rest;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import de.vommond.streamui.Config;
import de.vommond.util.Logger;

/**
 * Application Lifecycle Listener implementation class Listner
 *
 */
public class Listner implements ServletContextListener {

    /**
     * Default constructor. 
     */
    public Listner() {
        // TODO Auto-generated constructor stub
    }

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	public void contextInitialized(ServletContextEvent context) {
		Logger.log(this.getClass(), "contextInitialized", "enter > "+ Config.AUTO_PATH);
		
		if(Config.AUTO_PATH){
			Config.ToplogyFolder = context.getServletContext().getRealPath(Config.ToplogyFolder);
			Config.KeyValuePath = context.getServletContext().getRealPath(Config.KeyValuePath);
			Config.H2Path = context.getServletContext().getRealPath(Config.H2Path);
			Config.LayoutFolder = context.getServletContext().getRealPath(Config.LayoutFolder);
		}
	}
	
}
