/**
 * Functions to update graph and gui values via MQTT-messages
 *
 * @author Kevin Wieland
 * @author Michael Ortenstein
 */

function getCol(matrix, col){
	var column = [];
	for(var i=0; i<matrix.length; i++){
		column.push(matrix[i][col]);
	}
	return column;
}

function convertToKw(dataColum) {
	var convertedDataColumn = [];
	dataColum.forEach((value) => {
		convertedDataColumn.push(value / 1000);
	});
	return convertedDataColumn;
}

function handlevar(mqttmsg, mqttpayload) {
	// receives all messages and calls respective function to process them
	if ( mqttmsg.match( /^openwb\/graph\//i ) ) { processGraphMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/evu\//i) ) { processEvuMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/global\//i) ) { processGlobalMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/housebattery\//i) ) { processHousebatteryMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/system\//i) ) { processSystemMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/pv\//i) ) { processPvMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/verbraucher\//i) ) { processVerbraucherMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/lp\//i) ) { processLpMessages(mqttmsg, mqttpayload); }
	else if ( mqttmsg.match( /^openwb\/hook\//i) ) { processHookMessages(mqttmsg, mqttpayload); }
}  // end handlevar

function processGraphMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/graph
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg == 'openWB/graph/boolDisplayHouseConsumption' ) {
		if ( mqttpayload == 1) {
			boolDisplayHouseConsumption = false;
			hidehaus = 'foo';
		} else {
			boolDisplayHouseConsumption = true;
			hidehaus = 'Hausverbrauch';
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayLegend' ) {
		if ( mqttpayload == 0) {
			boolDisplayLegend = false;
		} else {
			boolDisplayLegend = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayLiveGraph' ) {
		if ( mqttpayload == 0) {
			$('#thegraph').hide();
			boolDisplayLiveGraph = false;
		} else {
			$('#thegraph').show();
			boolDisplayLiveGraph = true;
		}
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayEvu' ) {
		if ( mqttpayload == 1) {
			boolDisplayEvu = false;
			hideevu = 'foo';
		} else {
			boolDisplayEvu = true;
			hideevu = 'Bezug';
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayPv' ) {
		if ( mqttpayload == 1) {
			boolDisplayPv = false;
			hidepv = 'foo';
		} else {
			boolDisplayPv = true;
			hidepv = 'PV';
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/booldisplaylp[1-9][0-9]*$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		// now call functions or set variables corresponding to the index
		if ( mqttpayload == 1) {
			window['boolDisplayLp'+index] = false;
			window['hidelp'+index] = 'foo';
		} else {
			window['boolDisplayLp'+index] = true;
			window['hidelp'+index] = 'Lp' + index;
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplayLpAll' ) {
		if ( mqttpayload == 1) {
			boolDisplayLpAll = false;
			hidelpa = 'foo';
		} else {
			boolDisplayLpAll = true;
			hidelpa = 'LP Gesamt';
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplaySpeicher' ) {
		if ( mqttpayload == 1) {
			boolDisplaySpeicher = false;
			hidespeicher = 'foo';
		} else {
			hidespeicher = 'Speicherleistung';
			boolDisplaySpeicher = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg == 'openWB/graph/boolDisplaySpeicherSoc' ) {
		if ( mqttpayload == 1) {
			hidespeichersoc = 'foo';
			boolDisplaySpeicherSoc = false;
		} else {
			hidespeichersoc = 'Speicher SoC';
			boolDisplaySpeicherSoc = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/booldisplaylp[1-9][0-9]*soc$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		if ( mqttpayload == 1) {
			$('#socenabledlp' + index).show();
			window['boolDisplayLp' + index + 'Soc'] = false;
			window['hidelp' + index + 'soc'] = 'foo';
		} else {
			$('#socenabledlp' + index).hide();
			window['boolDisplayLp' + index + 'Soc'] = true;
			window['hidelp' + index + 'soc'] = 'LP' + index + ' SoC';
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/booldisplayload[1-9][0-9]*$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		// now call functions or set variables corresponding to the index
		if ( mqttpayload == 1) {
			window['hideload'+index] = 'foo';
			window['boolDisplayLoad'+index] = false;
		} else {
			window['hideload'+index] = 'Verbraucher ' + index;
			window['boolDisplayLoad'+index] = true;
		}
		checkgraphload();
	}
	else if ( mqttmsg.match( /^openwb\/graph\/[1-9][0-9]*alllivevalues$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		// now call functions or set variables corresponding to the index
		if (initialread == 0) {
			window['all'+index+'p'] = mqttpayload;
			window['all'+index] = 1;
			putgraphtogether();
		}
	}
	else if ( mqttmsg == 'openWB/graph/lastlivevalues' ) {
		if ( initialread > 0) {
			updateGraph(mqttpayload);
		}
	}
}  // end processGraphMessages

function processEvuMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/evu
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg == 'openWB/evu/W' ) {
	    var powerEvu = mqttpayload;
	    var powerEvu = parseInt(powerEvu, 10);
		if ( isNaN(powerEvu) || powerEvu == 0 ) {
			powerEvu = '0 W';
		} else if (powerEvu > 0) {
	    	if (powerEvu > 999) {
		    	powerEvu = (powerEvu / 1000).toFixed(2);
	    	    powerEvu += ' kW Bezug';
	    	} else {
				powerEvu += ' W Bezug';
			}
    	} else {
    	    powerEvu *= -1;
			if (powerEvu > 999) {
		    	powerEvu = (powerEvu / 1000).toFixed(2);
	    	    powerEvu += ' kW Einspeisung';
	    	} else {
				powerEvu += ' W Einspeisung';
			}
    	}
	    $('#bezug').text(powerEvu);
	 }
}

function processGlobalMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/global
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg == 'openWB/global/WHouseConsumption' ) {
		var powerHouse = parseInt(mqttpayload, 10);
		if ( isNaN(powerHouse) ) {
			powerHouse = 0;
		}
		if ( powerHouse > 999 ) {
			powerHouse = (powerHouse / 1000).toFixed(2) + ' kW';
		} else {
			powerHouse += ' W';
		}
		$('#hausverbrauch').text(powerHouse);
	}
	else if ( mqttmsg == 'openWB/global/WAllChargePoints') {
		var powerAllLp = parseInt(mqttpayload, 10);
		if ( isNaN(powerAllLp) ) {
			powerAllLp = 0;
		}
		if (powerAllLp > 999) {
			powerAllLp = (powerAllLp / 1000).toFixed(2) + ' kW';
		} else {
			powerAllLp += ' W';
		}
		$('#powerAllLp').text(powerAllLp);
	}
	else if ( mqttmsg == 'openWB/global/strLastmanagementActive' ) {
		if ( mqttpayload.length >= 5 ) {
			// if there is info-text in payload for topic, show the text
			$('#lastregelungaktiv').text(mqttpayload);
		} else {
			// if there is no text, show nothing (hides row)
			$('#lastregelungaktiv').text('');
		}
	}
	else if ( mqttmsg == 'openWB/global/awattar/pricelist' ) {
		// read awattar values and trigger graph creation
		// loadawattargraph will show awattardiv is awataraktiv=1 in openwb.conf
		// graph will be redrawn after 5 minutes (new data pushed from cron5min.sh)
		var csvaData = [];
		var rawacsv = mqttpayload.split(/\r?\n|\r/);
		for (var i = 0; i < rawacsv.length; i++) {
			  csvaData.push(rawacsv[i].split(','));
		}
		awattartime = getCol(csvaData, 0);
		graphawattarprice = getCol(csvaData, 1);
		loadawattargraph();
	}
	else if ( mqttmsg == 'openWB/global/awattar/MaxPriceForCharging' ) {
		$('#awattar1s').val(mqttpayload);
		$('#awattar1l').text(mqttpayload);
	}
	else if ( mqttmsg == 'openWB/global/ChargeMode' ) {
		// set modal button colors depending on charge mode
		// set visibility of divs
		// set visibility of priority icon depending on charge mode
		// (priority icon is encapsulated in another element hidden/shown by housebattery configured or not)
		switch (mqttpayload) {
			case '0':
				// mode sofort
				$('#chargeModeSelectBtnText').text('Sofortladen');  // text btn mainpage
				$('.chargeModeBtn').removeClass('btn-success');  // changes to select btns in modal
				$('#chargeModeSofortBtn').addClass('btn-success');
				$('#targetChargingProgress').show();  // visibility of divs for special settings
				$('#sofortladenEinstellungen').show();
				$('#priorityEvBatteryIcon').hide();  // visibility of priority icon
				break;
			case '1':
				// mode min+pv
				$('#chargeModeSelectBtnText').text('Min+PV-Laden');
				$('.chargeModeBtn').removeClass('btn-success');
				$('#chargeModeMinPVBtn').addClass('btn-success');
				$('#targetChargingProgress').hide();
				$('#sofortladenEinstellungen').hide();
				$('#priorityEvBatteryIcon').hide();
				break;
			case '2':
				// mode pv
				$('#chargeModeSelectBtnText').text('PV-Laden');
				$('.chargeModeBtn').removeClass('btn-success');
				$('#chargeModePVBtn').addClass('btn-success');
				$('#targetChargingProgress').hide();
				$('#sofortladenEinstellungen').hide();
				$('#priorityEvBatteryIcon').show();
				break;
			case '3':
				// mode stop
				$('#chargeModeSelectBtnText').text('Stop');
				$('.chargeModeBtn').removeClass('btn-success');
				$('#chargeModeStopBtn').addClass('btn-success');
				$('#targetChargingProgress').hide();
				$('#sofortladenEinstellungen').hide();
				$('#priorityEvBatteryIcon').hide();
				break;
			case '4':
				// mode standby
				$('#chargeModeSelectBtnText').text('Standby');
				$('.chargeModeBtn').removeClass('btn-success');
				$('#chargeModeStdbyBtn').addClass('btn-success');
				$('#targetChargingProgress').hide();
				$('#sofortladenEinstellungen').hide();
				$('#priorityEvBatteryIcon').hide();
		}
	}
	else if ( mqttmsg == 'openWB/global/priorityModeEVBattery' ) {
		// sets button color in charge mode modal and sets icon in mode select button
		switch (mqttpayload) {
			case '0':
				// battery priority
				$('#evPriorityBtn').removeClass('btn-success');
				$('#batteryPriorityBtn').addClass('btn-success');
				$('#priorityEvBatteryIcon').removeClass('fa-car').addClass('fa-car-battery')
				break;
			case '1':
				// ev priority
				$('#evPriorityBtn').addClass('btn-success');
				$('#batteryPriorityBtn').removeClass('btn-success');
				$('#priorityEvBatteryIcon').removeClass('fa-car-battery').addClass('fa-car')
			break;
		}
	}
}

function processHousebatteryMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/housebattery
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg == 'openWB/housebattery/W' ) {
		var speicherwatt = mqttpayload;
		var speicherwatt = parseInt(speicherwatt, 10);
		if ( isNaN(speicherwatt) ) {
			speicherwatt = 0;
		}
		if ( speicherwatt == 0 ) {
			speicherwatt = '0 W';
		} else if (speicherwatt > 0) {
			if ( speicherwatt > 999 ) {
				speicherwatt = (speicherwatt / 1000).toFixed(2);
				speicherwatt = speicherwatt + ' kW Ladung';
			} else {
				speicherwatt = speicherwatt + ' W Ladung';
			}
		} else {
	    	speicherwatt *= -1;
			if (speicherwatt > 999) {
				speicherwatt = (speicherwatt / 1000).toFixed(2);
				speicherwatt = speicherwatt + ' kW Entladung';
			} else {
				speicherwatt = speicherwatt + ' W Entladung';
			}
		}
		$('#speicherleistung').text(speicherwatt);
	}
	else if ( mqttmsg == 'openWB/housebattery/%Soc' ) {
		var speicherSoc = parseInt(mqttpayload, 10);
		if ( isNaN(speicherSoc) || speicherSoc < 0 || speicherSoc > 100 ) {
			speicherSoc = '--';
		}
		speichersoc = ', ' + speicherSoc + ' % SoC';
		$('#speichersoc').text(speichersoc);
	}
	else if ( mqttmsg == 'openWB/housebattery/boolHouseBatteryConfigured' ) {
		if ( mqttpayload == 1 ) {
			// if housebattery is configured, show info-div
			$('#speicher').show();
			// and outer element for priority icon in pv mode
			$('#priorityEvBattery').show();
			// priority buttons in modal
			$('#priorityModeBtns').show();
		} else {
			$('#speicher').hide();
			$('#priorityEvBattery').hide();
			$('#priorityModeBtns').hide();
		}
	}
}

function processSystemMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/system
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg == 'openWB/system/Timestamp') {
		var dateObject = new Date(mqttpayload * 1000);  // Unix timestamp to date-object
		var time = '&nbsp;';
		var date = '&nbsp;';
		if ( dateObject instanceof Date && !isNaN(dateObject.valueOf()) ) {
			// timestamp is valid date so process
			var HH = String(dateObject.getHours()).padStart(2, '0');
			var MM = String(dateObject.getMinutes()).padStart(2, '0');
			time = HH + ':'  + MM;
			var dd = String(dateObject.getDate()).padStart(2, '0');  // format with leading zeros
			var mm = String(dateObject.getMonth() + 1).padStart(2, '0'); //January is 0 so add +1!
			var dayOfWeek = dateObject.toLocaleDateString('de-DE', { weekday: 'short'});
			date = dayOfWeek + ', ' + dd + '.' + mm + '.' + dateObject.getFullYear();
		}
		$('#time').text(time);
		$('#date').text(date);
	}
}

function processPvMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/pv
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg == 'openWB/pv/W') {
		var pvwatt = parseInt(mqttpayload, 10);
		if ( isNaN(pvwatt) ) {
			pvwatt = 0;
		}
		if ( pvwatt <= 0){
			// production is negative for calculations so adjust for display
			pvwatt *= -1;
			// adjust and add unit
			if (pvwatt > 999) {
				pvwatt = (pvwatt / 1000).toFixed(2) + ' kW';
			} else {
				pvwatt += ' W';
			}
		}
		$('#pvleistung').text(pvwatt);
	}
	else if ( mqttmsg == 'openWB/pv/DailyYieldKwh') {
		var pvDailyYield = parseFloat(mqttpayload);
		if ( isNaN(pvDailyYield) ) {
			pvDailyYield = 0;
		}
		var pvDailyYieldStr = ' (' + pvDailyYield.toFixed(2) + ' kWh)';
		$('#pvdailyyield').text(pvDailyYieldStr);
	}
}

function processVerbraucherMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/Verbraucher
	// called by handlevar
	processPreloader(mqttmsg);
}

function processLpMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/lp
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/w$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.actualPowerLp');  // now get parents respective child element
		var actualPower = parseInt(mqttpayload, 10);
		if ( isNaN(actualPower) ) {
			actualPower = 0;
		}
		if (actualPower > 999) {
			actualPower = (actualPower / 1000).toFixed(2);
			actualPower += ' kW';
		} else {
			actualPower += ' W';
		}
		$(element).text(actualPower);
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/kWhchargedsinceplugged$/i ) ) {
		// energy charged since ev was plugged in
		// also calculates and displays km charged
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.energyChargedLp');  // now get parents respective child element
		var energyCharged = parseFloat(mqttpayload, 10);
		if ( isNaN(energyCharged) ) {
			energyCharged = 0;
		}
		$(element).text(energyCharged.toFixed(1) + ' kWh');
		var kmChargedLp = $(parent).find('.kmChargedLp');  // now get parents kmChargedLp child element
		var consumption = $(kmChargedLp).attr('consumption');
		var kmCharged = '';
		if ( !isNaN(consumption) && consumption > 0 ) {
			kmCharged = (energyCharged / consumption) * 100;
			kmCharged = ' / ' + kmCharged.toFixed(1) + ' km';
		}
		$(kmChargedLp).text(kmCharged);
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/\%soc$/i ) ) {
		// soc of ev at respective charge point
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.socLp');  // now get parents respective child element
		var soc = parseInt(mqttpayload, 10);
		if ( isNaN(soc) || soc < 0 || soc > 100 ) {
			soc = '--';
		}
		$(element).text(soc + ' %');
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/timeremaining$/i ) ) {
		// time remaining for charging to target value
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		$('#restzeitlp' + index).text(mqttpayload);
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolchargeatnight$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.nightChargingLp');  // now get parents respective child element
		if ( mqttpayload == 1 ) {
			$(element).show();
		} else {
			$(element).hide();
		}
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolplugstat$/i ) ) {
		// status ev plugged in or not
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.plugstatLp');  // now get parents respective child element
		if ( mqttpayload == 1 ) {
			$(element).show();
		} else {
			$(element).hide();
		}
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolchargestat$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.plugstatLp');  // now get parents respective child element
		if ( mqttpayload == 1 ) {
			$(element).removeClass('text-lightgrey').addClass('text-green');
		} else {
			$(element).removeClass('text-green').addClass('text-lightgrey');
		}
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/adirectmodeamps$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var current = parseInt(mqttpayload, 10);
		if ( isNaN(current) ) {
			current = 0;
		}
		$('#sofortlllp' + index + 's').val(current);
		$('sofortlllp' + index + 'l').text(current);
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/strchargepointname$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		$('.nameLp').each(function() {  // fill in name for all element of class '.nameLp'
			var lp = $(this).closest('[lp]').attr('lp');  // get attribute lp from parent
			if ( lp == index ) {
	    		$(this).text(mqttpayload);
			}
	    });
	}
	if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/chargepointenabled$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		$('.nameLp').each(function() {  // check all elements of class '.nameLp'
			var lp = $(this).closest('[lp]').attr('lp');  // get attribute lp from parent
			if ( lp == index ) {
				if ( $(this).hasClass('enableLp') ) {
					// but only apply styles to element in chargepoint info data block
					if ( mqttpayload == 0 ) {
						$(this).removeClass('lpEnabledStyle').addClass('lpDisabledStyle');
					} else {
						$(this).removeClass('lpDisabledStyle').addClass('lpEnabledStyle');
					}
				}
			}
		});
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolsocconfigured$/i ) ) {
		// soc-module configured for respective charge point
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var elementIsConfigured = $(parent).find('.socConfiguredLp');  // now get parents respective child element
		var elementIsNotConfigured = $(parent).find('.socNotConfiguredLp');  // now get parents respective child element
		if (mqttpayload == 1) {
			$(elementIsNotConfigured).hide();
			$(elementIsConfigured).show();
		} else {
			$(elementIsNotConfigured).show();
			$(elementIsConfigured).hide();
		}
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolchargepointconfigured$/i ) ) {
		// respective charge point configured
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var infoElement = $('.chargePointInfoLp[lp="' + index + '"]');  // get row of charge point
		var targetChargeElements = $('.targetChargeLp[lp="' + index + '"]');  // get column elements for target charging
		if (mqttpayload == 1) {
			$(infoElement).show();
			$(targetChargeElements).show();
		} else {
			$(infoElement).hide();
			$(targetChargeElements).hide();
		}
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/autolockconfigured$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.autolockConfiguredLp');  // now get parents respective child element
		if ( mqttpayload == 0 ) {
			$(element).hide();
		} else {
			$(element).show();
		}
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/autolockstatus$/i ) ) {
		// values used for AutolockStatus flag:
		// 0 = standby
		// 1 = waiting for autolock
		// 2 = autolock performed
		// 3 = auto-unlock performed
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.autolockConfiguredLp');  // now get parents respective child element
		switch ( mqttpayload ) {
			case '0':
				// remove animation from span and set standard colored key icon
				$(element).removeClass('fa-lock fa-lock-open animate-alertPulsation text-red text-green');
				$(element).addClass('fa-key');
				break;
			case '1':
				// add animation to standard icon
				$(element).removeClass('fa-lock fa-lock-open text-red text-green');
				$(element).addClass('fa-key animate-alertPulsation');
				break;
			case '2':
				// add red locked icon
				$(element).removeClass('fa-lock-open fa-key animate-alertPulsation text-green');
				$(element).addClass('fa-lock text-red');
				break;
			case '3':
				// add green unlock icon
				$(element).removeClass('fa-lock fa-key animate-alertPulsation text-red');
				$(element).addClass('fa-lock-open text-green');
				break;
		}
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/energyconsumptionper100km$/i ) ) {
		// store configured value in element attribute
		// to calculate charged km upon receipt of charged energy
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.kmChargedLp');  // now get parents respective child element
		var consumption = parseFloat(mqttpayload);
		if ( isNaN(consumption) ) {
			consumption = 0;
		}
		$(element).attr('consumption', consumption);
		// if already energyCharged-displayed, update kmCharged
		var energyChargedLp = $(parent).find('.energyChargedLp');  // now get parents respective energyCharged child element
		var energyCharged = parseFloat($(energyChargedLp).text());
		var kmCharged = '';
		if ( !isNaN(energyCharged) && consumption > 0 ) {
			kmCharged = (energyCharged / consumption) * 100;
			kmCharged = ' / ' + kmCharged.toFixed(1) + ' km';
		}
		$(element).text(kmCharged);
	}
	else if ( mqttmsg.match( /^openwb\/lp\/[1-9][0-9]*\/boolfinishattimechargeactive$/i ) ) {
		// respective charge point configured
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		var parent = $('.chargePointInfoLp[lp="' + index + '"]');  // get parent row element for charge point
		var element = $(parent).find('.targetChargingLp');  // now get parents respective child element
		if (mqttpayload == 1) {
			$(element).show();
		} else {
			$(element).hide();
		}
	}
}

function processHookMessages(mqttmsg, mqttpayload) {
	// processes mqttmsg for topic openWB/hook
	// called by handlevar
	processPreloader(mqttmsg);
	if ( mqttmsg.match( /^openwb\/hook\/[1-9][0-9]*\/boolhookstatus$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		if ( mqttpayload == 1 ) {
			$('#hook' + index).removeClass("bg-danger").addClass("bg-success");
		} else {
			$('#hook' + index).removeClass("bg-success").addClass("bg-danger");
		}
	}
	else if ( mqttmsg.match( /^openwb\/hook\/[1-9][0-9]*\/boolhookconfigured$/i ) ) {
		var index = mqttmsg.match(/\d/g)[0];  // extract first match = number from mqttmsg
		if ( mqttpayload == 1 ) {
			$('#hook' + index).show();
		} else {
			$('#hook' + index).hide();
		}
	}
}
