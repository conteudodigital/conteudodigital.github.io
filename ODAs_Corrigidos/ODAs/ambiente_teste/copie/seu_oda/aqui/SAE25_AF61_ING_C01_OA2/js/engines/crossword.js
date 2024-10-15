CruzadinhaEngine = function() {
    this.globalConfig = 0;
    this.levelConfig = 0;
    this.isKeyboardActive = false;
    this.typpingOrientation = null;
    this.activeCell = null;
    this.eventsMap = [["mousedown", "touchstart"], ["mouseup", "touchend"]];
    this.specialCharTimeout = null;
    this.gonnaTypeSpecialChar = false;
    this.keyboardHeightPx = 190;
    this.rightAnswersCount = 0;
    this.hasInitialized = false;
	
    this.clearStage = function() {
        $("#gridArea").html("");
        $("#div_area_crossword").hide();
        $(".keyboardRow").each(function() {
            $(this).html("");
        });
		
        areaCrosswordClassName = "level" + system._stageIndex;
        $("#div_area_crossword").removeClass(areaCrosswordClassName);
		
        this.rightAnswersCount = 0;
		
        $("#hintList").html("");
    };
	
    this.initializeEngine = function() {
        if (this.hasInitialized) {
            return;
		}
		
        $("title").html(this.globalConfig.title);
        var tempEventsMap = [];
		
        for (var i in this.eventsMap) {
            if ('ontouchstart' in document.documentElement) {
                {tempEventsMap.push(this.eventsMap[i][1])};
			}
            else {
                tempEventsMap.push(this.eventsMap[i][0]);
            }
        }
		
        this.hasInitialized = true;
        this.eventsMap = tempEventsMap;
    };
	
    this.showAllAnswers = function() {
    	$(".inputCell").each(function() {
			$(this).html(eval("crossword.levelConfig.letters." + $(this).attr("id")));
		});
    };
	
    this.keyPressHandler = function(e) {
	    e = e || window.event;
	    var charCode = e.keyCode || e.which;
		
	    var charStr = String.fromCharCode(charCode).toLowerCase();

	    self.clickKey(charStr);
    };
	
    this.keyDownHandler = function(e) {
	    e = e || window.event;
	    var charCode = e.keyCode || e.which;
		
	    if (charCode == 8) {
	    	self.clickKey("backspace");
	    	e.preventDefault();
	    	return false;
	    }
    };
	
    this.clickKey = function(char) {
    	$(".keyboardKey[data-letter='" + char + "']").click();
    }
	
    this.areAllAnswersCorrect = function() {
        return (this.rightAnswersCount == this.levelConfig.hints.length);
	};
	
    this.initializeStage = function() {
		$("#div_area_crossword").show();
		
        this.levelConfig = system.getConfig();
		
		levelClassName = "level" + system._stageIndex;
		$('#div_area_crossword').removeClass().addClass(levelClassName);
		
        this.createKeyboard();
		
        // define novo intro
        $('.topo .intro').show();
        $('.introbox .title').html(gameConfig.nome);
        $('.tuto_content').hide();
        $(".introbox-container").show();
        
        $('.introbox .content p ').html(this.levelConfig.message);
        $('.introbox .btn_audio').unbind("click").click(function(e) {
            sound.setMessageSound(self.levelConfig.soundMessage, function() {
                setTimeout(function() {
					system.hideIntroBox();
				}, 1000);
            });
            e.stopPropagation();
        }).trigger('click');
		
        if (this.levelConfig.type == "text") {
        	$("#hintList").hide();
		}
        else if (this.levelConfig.type == "image") {
        	$("#hintList").show();
		}
		
        system.showIntroBox(false, false);
    };
	
    this.startNew = function() {
		this.setInitialization();
        this.clearStage();
        this.initializeEngine();
        this.initializeStage();
        this.createLetterContainers();
        this.fillCells();
        this.createHints();
        this.bindEvents();
        scores.timeHandler();
    };
	
	this.setInitialization = function() {
		//pontuação inicial
		cfg = crossword.levelConfig;
		
        initialScore = cfg.initialScore ? cfg.initialScore : 10;
        rightIncrement = cfg.rightIncrement ? cfg.rightIncrement : 2;
        wrongIncrement = cfg.wrongIncrement ? cfg.wrongIncrement : -1;
		
        scores.setInitialScore(initialScore);
        scores.setRightIncrement(rightIncrement);
        scores.setWrongIncrement(wrongIncrement);
	};
	
    this.showMessage = function(x) {
    	if ($(".messageBox").length == 0) {
	        $("<div>").addClass("messageBox").appendTo($("body"));
		}
		
	    $(".messageBox").html(x);
		
        $(".messageBox").fadeIn(600);
		
        window.setTimeout(function() {
            $(".messageBox").fadeOut(400);
        }, 3500);
    };
	
    this.createLetterContainers = function() {
        for(var j =- 1; j < this.levelConfig.rows; j++) {
            thisRow = $("<div class='letterRow'></div>");
            thisRow.attr("id", "R"+j)
            for(var i =- 1; i < this.levelConfig.columns; i++) {
                thisCell = $("<div class='cell' id='C" + i + "_" + j + "'></div>");
				
                if (i >= 0 && j >= 0) {
                    if (eval("typeof this.levelConfig.letters.C" + i + "_" + j + " != 'undefined'")) {
                    	if (eval("this.levelConfig.letters.C" + i + "_" + j + " == '*'")) {
                    		thisCell.addClass("spaceCell blockedCell");
						}
                    	else {
                       		thisCell.addClass("inputCell");
						}
                    }
				}
                thisRow.append(thisCell);
            }
            $(thisRow).appendTo($("#gridArea"));
        }
    };
	
    this.fillCells = function() {
    	preFillingData = this.levelConfig.pre_filled;
    	if (!preFillingData) {
    		return;
		}
		
    	if (preFillingData.columns) {
    		for (var i in preFillingData.columns) {
    			columnToFill = preFillingData.columns[i]
    			fillingIterator = firstItemToFill = $("#C" + (columnToFill - 1) + "_-1");
				while(this.getBottomCell(fillingIterator)) {
					fillingIterator = this.getBottomCell(fillingIterator);
					cellPosition = this.getCellPosition(fillingIterator);
					correctValue = eval("this.levelConfig.letters.C" + cellPosition[0] + "_" + cellPosition[1]);
					if (!correctValue) {
						continue;
					}
					fillingIterator.addClass("preFilledCell blockedCell").html(correctValue);
				}
    		}
		}
    };
	
    this.createHints = function() {
    	// SE SUAS IMAGENS ESTAO PEQUENAS
    	// VOCE ESTA NO LUGAR CERTO
    	// \/
        if (this.levelConfig.type == "image") {
            for (var i = 0; i < this.levelConfig.hints.length; i++) {
                thisHint = this.levelConfig.hints[i];
				
                thisHintElement = $("<div>");
				
                if (typeof thisHint.row != "undefined" && typeof thisHint.column != "undefined") {
                	thisHintElement.attr("data-row", thisHint.row).attr("data-column", thisHint.column);
				}
                else if (typeof thisHint.row != "undefined") {
                	thisHintElement.attr("data-row", thisHint.row);
				}
               	else if (typeof thisHint.column != "undefined") {
               		thisHintElement.attr("data-column", thisHint.column);
				}
				
                thisHintElement.addClass("hintCell externalHint");
				
                if (thisHint.image) {
                    thisHintElement.addClass("hintImage").append($("<img>").attr("src", thisHint.image));
				}
				
                if (thisHint.audio) {
                	thisHintElement.addClass("hintAudio").attr("data-audio", thisHint.audio);
				}
				
                $("#hintList").append(thisHintElement);
            }
        }
		
        $(".hintImage img").attr("width", "130");
		
        for (var i = 0; i < this.levelConfig.hints.length; i++) {
            thisHint = this.levelConfig.hints[i];
			
            var hintContent = $("<div>").addClass("hintContent");
			
            if (typeof thisHint.row != "undefined" && typeof thisHint.column != "undefined") {
            	idCellToCreateHint = "C" + (thisHint.column - 1) + "_" + (thisHint.row - 1);
            	cellToCreateHint = $("#" + idCellToCreateHint);
            	if (thisHint.orientation == "row") {
            		cellToCreateHint.addClass("row-hint");
				}
            	else if (thisHint.orientation == "column") {
            		cellToCreateHint.addClass("column-hint");
				}
            }
			else if (typeof thisHint.row != "undefined") {
                rowToCreateHint = $("#R"+(thisHint.row-1));
				
                rowToCreateHint.find("div").each(function(i) {
                    if ($(this).hasClass("inputCell")) {
                        cellToCreateHint = $("#C" + (i - 2) + "_" + (thisHint.row - 1));
                        cellToCreateHint.addClass("row-hint");
                        return false;
                    }
                });
            }
            else if (typeof thisHint.column != "undefined") {
                for(var u = 0; u < this.levelConfig.rows; u++) {
                    thisCell = $("#C" + (thisHint.column - 1) + "_" + u);
                    if (thisCell.hasClass("inputCell")) {
                        cellToCreateHint = $("#C" + (thisHint.column - 1) + "_" + (u - 1));
                        cellToCreateHint.addClass("column-hint");
                        break;
                    }
                }
            }
			
        	hintContent = $("<div>").addClass("hintContentWrapper").append(hintContent);
            hintContent.append($("<div>").addClass("hintContentHelper"));
			
           	if (typeof this.levelConfig.audioHints != "undefined" && this.levelConfig.audioHints == true) {
           		hintImageName = (i+1) + "_audio.png";
			}
           	else {
           		hintImageName = (i+1) + ".png"
			}
			
            cellToCreateHint.addClass("hintCell").css("background-image", "url('img/crossword/" + hintImageName + "')");
			
            if (typeof thisHint.image != "undefined") {
                $("<div>").addClass("imageHint").html("<img src='" + thisHint.image + "'>").appendTo(hintContent.find(".hintContent"));
			}
			
            if (typeof thisHint.text != "undefined") {
                $("<div>").addClass("textHint").html("<p>"+thisHint.text+"</p>").appendTo(hintContent.find(".hintContent"));
			}
			
            if (typeof thisHint.audio != "undefined") {
            	$("<div>").addClass("audioHint").appendTo(hintContent.find('.textHint p'));
            	cellToCreateHint.attr("audio-data", thisHint.audio);
            }
			
            if (typeof this.levelConfig.showLocalHint != "undefined" && this.levelConfig.showLocalHint) {
            	cellToCreateHint.append(hintContent);
			}
        }
    };
	
    this.createKeyboard = function() {
        var lettersArray = [
            ["q","w","e","r","t","y","u","i","o","p"],
            ["a","s","d","f","g","h","j","k","l", "ç"],
            ["z","x","c","v","b","n","m"]
        ];
		
        var specialCharsArray = {
            a: ["á", "à", "ã", "â"],
            e: ["é", "ê"],
            i: ["í", "î"],
            o: ["ó", "ô", "õ"],
            u: ["ú"]
        };
		
        $(".keyboardRow").each(function(i) {
            for(var k in lettersArray[i]) {
                thisKey = $("<div></div>").addClass("keyboardKey");
                thisKey.html(lettersArray[i][k]);
                thisKey.attr("data-letter", lettersArray[i][k]);
                if (eval("typeof specialCharsArray." + lettersArray[i][k]) != "undefined") {
                    thisSubGroupKeys = eval("specialCharsArray."+lettersArray[i][k]);
                    thisSubgroup = $("<div></div>").addClass("keySubgroup");

                    for (var u in thisSubGroupKeys) {
                        thisSubgroup.append($("<div></div>").attr("data-letter", thisSubGroupKeys[u]).html(thisSubGroupKeys[u]).addClass("keyboardKey"));
                    }
                    thisKey.append(thisSubgroup);
                }
				
                $("#keyboardContainer .keyboardRow").eq(i).append(thisKey);
            }
        });
		
        $("#firstRow").append($("<div>").html("").addClass("keyboardKey backspace").attr("data-letter", "backspace"));
    };

    this.showKeyboard = function(selectedHint) {
        this.handleScroll(selectedHint);
        $("#keyboardContainer").show().animate({
			"height": this.keyboardHeightPx + "px"
		}, 500, function() {
			self.isKeyboardActive = 1
		});
    };
	
    this.hideKeyboard = function() {
        this.handleScroll();
		
        $("#keyboardContainer").animate({
			"height": "0"
		}, 300, function() {
			self.isKeyboardActive = 0;
		}).hide();
    };
	
    this.handleScroll = function(selectedHint) {
		if (typeof selectedHint == "undefined") {
			$("#gridAreaWrapper").css("height", "auto");
			$("#gridAreaWrapper").css("overflow", "visible");
			return;
		}
		
		$("#gridAreaWrapper").scrollTop(0);
		var selectedHintPosition = selectedHint.offset().top + selectedHint.height() + 10;
		
		if (selectedHintPosition >= $(window).height() - this.keyboardHeightPx) {
			var newGridAreaHeight = $(window).height() - this.keyboardHeightPx - parseInt($("#gridAreaWrapper").css("margin-top")) - 50;
			var selectedHintOffsetPosition = selectedHint.position().top - parseInt($("#gridAreaWrapper").css("margin-top"));
			var selectedHintScrollHeight = -newGridAreaHeight + selectedHintOffsetPosition + selectedHint.height() + 30;
			
			$("#gridAreaWrapper").css("overflow", "auto");
			$("#gridAreaWrapper").height(newGridAreaHeight);
			
			$("#gridAreaWrapper").scrollTop(selectedHintScrollHeight);
		}
		else {
			$("#gridAreaWrapper").css("height", "auto");
			$("#gridAreaWrapper").css("overflow", "visible");
		}
    };
	
    this.bindEvents = function() {
        $(document).unbind();
		
        $(document).keypress(function(e){self.keyPressHandler(e)});
        $(document).keydown(function(e){self.keyDownHandler(e)});
		
        $(".hintCell").click(function(e) {
			self.hintClickHandler(e, $(this));
		});
        $("#game_container").click(function(e) {
			self.containerClickHandler(e);
		});
        $(".keyboardKey").click(function(e) {
			self.keyboardKeyClickHandler(e, $(this));
		});
        $(".audioHint").click(function(e) {
			self.audioHintHandler(e, $(this));
		});
        $(".inputCell").click(function(e) {
			self.cellClickHandler(e, $(this));
		});
        $(".keyboardKey").bind(this.eventsMap[0], function() {
			self.touchDownHandler($(this));
		});
        $(".keyboardKey").bind(this.eventsMap[1], function() {
			self.touchUpHandler($(this));
		});
        $("#keyboardContainer").click(function(e) {
			self.keyboardContainerClickHandler(e);
		});
    };
	
    this.cellClickHandler = function(event, cell) {
	    if (cell.prev().hasClass("hintCell")) {
            this.hintClickHandler(event, cell.prev());
		}
        else if (this.getTopCell(cell).hasClass("hintCell")) {
    		this.hintClickHandler(event, this.getTopCell(cell));
		}
    };
	
    this.keyboardContainerClickHandler = function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(".keySubgroup").hide();
    };
	
    this.hintClickHandler = function(event, hintElement) {
    	this.containerClickHandler(event);
		
        event.stopPropagation();
		
        $(".activeHint").removeClass("activeHint");
		
		if (hintElement.hasClass("externalHint")) {
			//find the correspoding internal hint and click it
			if (hintElement.attr("data-row") != undefined && hintElement.attr("data-column") != undefined) {
				correspodingHint = $("#C" + (hintElement.attr("data-column") - 1) + "_" + (hintElement.attr("data-row") - 1));
			}
        	else if (hintElement.attr("data-row") != undefined) {
        		correspodingHint = $("#R" + (hintElement.attr("data-row") - 1)).find(".hintCell:first");
			}
        	else if (hintElement.attr("data-column") != undefined) {
        		correspodingHint = $("#C" + (hintElement.attr("data-column")-1) + "_-1");
				
        		while(!correspodingHint.hasClass("hintCell")) {
        			correspodingHint = self.getBottomCell(correspodingHint);
        		}
        	}
			
    		correspodingHint.click();
			
        	return;
        }
		else if (hintElement.hasClass("hintCell")) {
        	//toque o audio da dica automaticamente APENAS SE não houver um container interno
        	if (hintElement.attr("audio-data") && hintElement.find(".hintContentWrapper").length == 0) {
        		sound.sounds(hintElement.attr("audio-data") + ".mp3");
			}
			
            if (this.activeCell) {
                this.activeCell.removeClass("activeCell");
			}
			
            $(".hintContentWrapper").hide();
            hintElement.find(".hintContentWrapper").show();
			
            if (hintElement.hasClass("row-hint")) {
            	this.typpingOrientation = 0;
			}
            else if (hintElement.hasClass("column-hint")) {
            	this.typpingOrientation = 1;
			}
			
            this.activeCell = this.getNextTextCell(hintElement);
			
            this.activateCell(this.activeCell);
            hintElement.addClass("activeHint");
        }
		
        this.showKeyboard(this.activeCell);
        this.activateCell(this.activeCell);
    };
	
    this.touchDownHandler = function(key) {
		clearTimeout(this.specialCharTimeout);
        this.specialCharTimeout = setTimeout(function() {
            self.gonnaTypeSpecialChar = true;
            self.showSubgroup(key);
        }, 1000);
    };
	
    this.touchUpHandler = function() {
        clearTimeout(this.specialCharTimeout);
    };
	
    this.audioHintHandler = function(e, hint) {
        e.stopPropagation()
        sound.sounds(hint.parent().parent().parent().parent().parent().attr("audio-data") + ".mp3");
    };
	
    this.keyboardKeyClickHandler = function(event, key) {
        event.stopPropagation();
		
        if (key.attr("data-letter") == "backspace") {
            if (!this.getPreviousTextCell(this.activeCell)) {
                return;
			}
			
            this.activeCell.removeClass("activeCell");
            this.activeCell = this.getPreviousTextCell(this.activeCell);
            this.activeCell.html("");
            this.activateCell(this.activeCell);
            return;
        }
		
        if (this.gonnaTypeSpecialChar && key.find(".keySubgroup").length == 1) {
            return;
		}
		
        this.activeCell.html(key.attr("data-letter")).removeClass("activeCell");
        $(".activeKey").removeClass("activeKey")
        key.addClass("activeKey");
		
        setTimeout(function() {
        	key.removeClass("activeKey");
        }, 300);
		
        this.gonnaTypeSpecialChar = false;
		
        clearTimeout(this.specialCharTimeout);
		
        cellIsAvailable = false;
        nextCell = this.getNextTextCell(this.activeCell);
		
        if (nextCell) {
            this.activeCell = nextCell;
            window.setTimeout(function() {
            	self.activateCell(self.activeCell);
            }, 20);
			
            this.handleScroll(this.activeCell);
        }
        else {
			$(".hintContentWrapper").hide();

			if(this.isAnswerCorrect(this.activeCell)) {
				this.markCorrectWord(this.activeCell);
			}
			else {
				this.markWrongWord(this.activeCell);
			}
			this.activeCell = this.isKeyboardActive = 0;
            this.hideKeyboard();
        }
		
        $(".keySubgroup").hide();
    };
	
    this.showSubgroup = function(key) {
        if (key.find(".keySubgroup").length == 1) {
            key.find(".keySubgroup").show();
		}
    };
	
    this.isAnswerCorrect = function(wordLastCell) {
        var isCorrect = true;
        iterationCell = wordLastCell;
		
        while (iterationCell) {
            cellPosition = this.getCellPosition(iterationCell);
            var correctCellValue = eval ("this.levelConfig.letters.C" + cellPosition[0] + "_" + cellPosition[1] + "");
            if (correctCellValue.toLowerCase() == iterationCell.html().toLowerCase()) {
            	iterationCell = this.getPreviousTextCell(iterationCell);
            }
            else if (this.clearLetter(correctCellValue.toLowerCase()) == iterationCell.html().toLowerCase()) {
				if (this.levelConfig.ignorarAcentuacao) {
					iterationCell = this.getPreviousTextCell(iterationCell);
				}
				else {
					self.markMissingSymbolWrong();
					this.showMessage("Você errou apenas um acento! Tente novamente.");
					return false;
				}
            }
            else {
				return false;
            }
        }
        return true;
    };
	
    this.markCorrectWord = function (cell) {
        var correctWordInterval;
        correctWordTimeout = setInterval(function() {
            cell.removeClass("rightAnswerCell").addClass("rightAnswerCell").addClass("blockedCell");
            if (self.getPreviousTextCell(cell)) {
                cell = self.getPreviousTextCell(cell)
			}
            else {
                clearInterval(correctWordTimeout);
			}
        }, 150);
		
        scores.correctCount();
        sound.sounds("mp3/acerto.mp3");
        this.rightAnswersCount++;
		
        if (this.areAllAnswersCorrect()) {
        	scores.pauseTime();
			window.setTimeout(function() {
			 system.scoreboard();
			}, 4000);
        }
    };
	
    this.markWrongWord = function (cell) {
        scores.wrongCount();
        sound.sounds("mp3/erro.mp3");
		
        while (cell) {
            if (!cell.hasClass("blockedCell")) {
                cell.addClass("wrongAnswerCell");
                cell.html("");
            }
			
            cell = this.getPreviousTextCell(cell);
        }
        window.setTimeout(function() {
            $(".wrongAnswerCell").removeClass("wrongAnswerCell");
        }, 1000);
    };
	
	this.markMissingSymbolWrong = function() {
		window.setTimeout(function() {
			$(".wrongAnswerCell").addClass("missingSymbolCell");
			
	        window.setTimeout(function() {
	            $(".missingSymbolCell").removeClass("missingSymbolCell");
	        }, 5000);
		}, 50);
    };
	
    this.containerClickHandler = function(event) {
        if (this.isKeyboardActive) {
            this.hideKeyboard();
		}
		
        $(".keySubgroup").hide();
		
        if (this.activeCell) {
            while(this.activeCell) {
            	if (!this.activeCell.hasClass("blockedCell")) {
                	this.activeCell.html("");
				}
				
            	this.activeCell.removeClass("activeCell");
                this.activeCell = this.getPreviousTextCell(this.activeCell);
            }
        }
        $(".activeHint").removeClass("activeHint");
        $(".hintContentWrapper").hide();
        this.activeCell = 0;
    };
	
    this.getCellPosition = function(cell) {
        return [parseInt(cell.attr("id").substr(1, cell.attr("id").length).split("_")[0]), parseInt(cell.attr("id").substr(1, cell.attr("id").length).split("_")[1])];
    };
	
    this.getNextTextCell = function(cell) {
        if (this.typpingOrientation == 0) {
        	if (cell.next().hasClass("blockedCell")) {
        		return this.getNextTextCell(cell.next());
			}
        	else if (!cell.next().hasClass("inputCell")) {
        		return null;
			}
        	else {
        		return cell.next();
			}
		}
        else if (this.typpingOrientation == 1) {
        	if (this.getBottomCell(cell)) {
	            if (this.getBottomCell(cell).hasClass("blockedCell")) {
	                return this.getNextTextCell(this.getBottomCell(cell));
				}
	            else if (!this.getBottomCell(cell).hasClass("inputCell")) {
	                return null;
				}
	            else {
	            	return this.getBottomCell(cell);
				}
			}
		}
    };
	
    this.getPreviousTextCell = function(cell) {
        if (this.typpingOrientation == 0) {
        	if (cell.prev().hasClass("blockedCell")) {
        		return this.getPreviousTextCell(cell.prev());
			}
        	else if (!cell.prev().hasClass("inputCell")) {
        		return null;
			}
        	else {
        		return cell.prev();
			}
		}
        else if (this.typpingOrientation == 1) {
        	if (this.getTopCell(cell)) {
	            if (this.getTopCell(cell).hasClass("blockedCell")) {
	                return this.getPreviousTextCell(this.getTopCell(cell));
				}
	            else if (!this.getTopCell(cell).hasClass("inputCell")) {
	                return null;
				}
	            else {
	            	return this.getTopCell(cell);
				}
			}
		}
    };
	
    this.getBottomCell = function(cell) {
        var thisCellPosition = this.getCellPosition(cell);
        if ($("#C" + thisCellPosition[0] + "_" + (thisCellPosition[1] + 1)).length > 0) {
        	return $("#C" + thisCellPosition[0] + "_" + (thisCellPosition[1] + 1));
		}
        else {
        	return null;
		}
    };
	
    this.getTopCell = function(cell) {
        var thisCellPosition = this.getCellPosition(cell);
        return $("#C" + thisCellPosition[0] + "_" + (thisCellPosition[1] - 1));
    };
	
    this.activateCell = function (cell) {
        cell.addClass("activeCell");
    };
	
    this.clearLetter = function(letter) {
        var specialCharsArray = {
            a: ["á", "à", "ã", "â"],
            e: ["é", "ê"],
            i: ["í", "î"],
            o: ["ó", "õ", "ô"],
            u: ["ú"],
            c: ["ç"]
        };
		
        for (var cleanedChar in specialCharsArray) {
            for(var i in specialCharsArray[cleanedChar]) {
                if (specialCharsArray[cleanedChar][i] == letter) {
                    return cleanedChar;
				}
			}
		}
		
		return letter;
    };
	
   	var self = this;
};

var crossword = new CruzadinhaEngine();