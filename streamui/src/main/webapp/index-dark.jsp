<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Vommond.de - StreamUI</title>
	
			
	<script src="libs/d3/d3.v3.min.js" charset="utf-8"></script>
	
	
	<script type="text/javascript">
		 dojoConfig= {
		        has: {
		            "dojo-firebug": true
		        },
		        parseOnLoad: false,
		        async: true,
		        locale:"en",
		        packages: [{
		            name: "de",
		            location: "../../de"
		        }]
		    };
	</script>


		
	<script src="libs/dojo/dojo.js"></script>


	<script type="text/javascript">
		// Load the widget parser and mobile base
		require(["dojo/parser","de/vommond/streamui/Page"],
			function(parser) {
				// Parse the page for widgets!
				parser.parse();
			}
		);
	</script>
	
	

	
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="libs/bootstrap/css/bootstrap.min.css">
	
	<!-- Optional theme -->
	<link rel="stylesheet" href="libs/bootstrap/css/bootstrap-theme.min.css">

		

	<style type="text/css">
		@import "style/vommond.css";
		@import "style/style.css";
		@import "style/dojo.css";
		@import "style/style-dark.css";
	</style>
	
</head>
<body>
	<div id="container" data-dojo-type="de/vommond/streamui/Page">
	</div>
</body>
</html>