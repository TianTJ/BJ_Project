function open_page(type){
	switch(type){
		case 0:
			window.location.href = "index.html"
			break;
		case 1:
			window.location.href = "contact.html"
			break;
		case 2:
			window.open("privacy.html")
			break;
		case 3:
			window.open("help.html")
			break;
		case 4:
			window.location.href = "droit.html"
			break;
		case 5:
			window.open("law.html")
			break;
		case 6:
			window.open("service.html")
			break;
		case 8:
			var sWindow = window.open();
			sWindow.location.href = "http://www.miibeian.gov.cn/state/outPortal/loginPortal.action;jsessionid=C7Qb79-yzF3Lx1ZuV-_Wy8ioR0j-dNwvxZSfmd7ynrNF35vDuPoy!-2113647171";
			break
		case 9:
			var sWindow = window.open();
			sWindow.location.href = "http://www.miitbeian.gov.cn/publish/query/indexFirst.action";
			break
		case 10:
			window.location.href = "about.html"
			break;
	}
		
}