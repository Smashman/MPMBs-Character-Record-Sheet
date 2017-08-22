//See if a string is the name of a magic item and return the MagicItemList attribute
function ParseMagicItem(Inputtxt) {
	if (!Inputtxt) return "";
	Inputtxt = removeDiacritics(Inputtxt);
	var tempFound = 0;
	var temp = "";
	for (var key in MagicItemList) {
		if (testSource(key, MagicItemList[key], "magicitemExcl")) continue; // test if the feat or its source isn't excluded
		if (tempFound < key.length && Inputtxt.toLowerCase().indexOf(MagicItemList[key].name.toLowerCase()) !== -1) {
			temp = key;
			tempFound = key.length;
		};
	};
	return temp;
};

function FindMagicItems(ArrayNmbr) {
	CurrentMagicItems.improvements = [];
	CurrentMagicItems.skills = [];

	for (var i = 0; i < FieldNumbers.magicitems; i++) {
		if (i !== ArrayNmbr) {
			var MitemFld = What("Extra.Magic Item " + (i + 1));
			CurrentMagicItems.known[i] = MitemFld ? ParseMagicItem(MitemFld) : "";
		};
	};

	for (i = 0; i < CurrentMagicItems.known.length; i++) {
		if (CurrentMagicItems.known[i]) {
			var theMI = MagicItemList[CurrentMagicItems.known[i]];
			//only add the armor proficiencies to global variables if feats are not set to manual
			if (theMI.armor && What("Manual Feat Remember") !== "Yes") {
				CurrentArmour.proficiencies[theMI.name + " (magic item)"] = theMI.armor;
			};
			if (theMI.weapons && What("Manual Feat Remember") !== "Yes") {
				CurrentWeapons.proficiencies[theMI.name + " (magic item)"] = theMI.weapons;
			};
			if (theMI.improvements) {
				CurrentMagicItems.improvements.push(theMI.improvements);
			};
			if (theMI.skills) {
				CurrentMagicItems.skills.push(theMI.skills);
			};
		};
	};
};

function ApplyMagicItem() {
	if (IsSetDropDowns) return; // when just changing the dropdowns, don't do anything
};

function SetMagicItemsdropdown() {
	var string = ""; // the tooltip for the Magic Item fields
	
	var TheList = [];
	for (var key in MagicItemList) {
		var miKey = MagicItemList[key];
		if (testSource(key, miKey, "magicitemExcl")) continue; // test if the feat or its source isn't excluded
		var miNm = miKey.name.capitalize();
		if (TheList.indexOf(miNm) === -1) TheList.push(miNm);
	};
	TheList.sort();
	TheList.unshift("");
	
	if (tDoc.getField("Extra.Magic Item 1").submitName === TheList.toSource()) return; //no changes, so no reason to do this
	tDoc.getField("Extra.Magic Item 1").submitName = TheList.toSource();
	
	for (var i = 1; i <= FieldNumbers.magicitems; i++) {
		var theFld = "Extra.Magic Item " + i;
		var theFldVal = What(theFld);
		tDoc.getField(theFld).setItems(TheList);
		if (theFldVal !== What(theFld)) Value(theFld, theFldVal, string);
	};
};

/* TO DO:
	- Magic Item improvements text in scores dialogue
	- Magic Item skills bonuses in skills tooltip
	- Change AddMagicItem and RemoveMagicItem functions
	- Add option to disable magic item automation
	- Make MagicItemList syntax file
*/