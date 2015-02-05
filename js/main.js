var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
	this.game.load.spritesheet('player', '/assets/advnt_full.png', 32, 65, 90);
	this.game.load.image('ground', '/assets/ledge.png');
	this.game.load.image('powerUp', '/assets/Chest.png');
	this.game.load.image('crate', '/assets/Crate.png');
	this.game.load.image('end', '/assets/Door.png');
	this.game.load.image('spikes', '/assets/Lava.png');
	this.game.load.audio('grunt','/assets/Grunt.wav');
};

GameState.prototype.create = function() {
    
	
	// Create a player sprite
    this.player = this.game.add.sprite(this.game.width/2 + 200, this.game.height / 2, 'player');
	this.player.anchor.setTo(0.5, 0.5);
	this.player.scale.setTo(2,2);
	
	this.grunt = this.game.add.audio('grunt');
	this.grunt.addMarker('jumpGrunt', 0, 0.5);
	
	this.player.animations.add('idle', [0], 10, false);
	this.player.animations.add('walk', [1,2,3,4,5,6], 9, true);
	this.player.animations.add('jump', [17,18,19], 9, false);
	this.player.animations.add('punch', [27,28], 9, false);
	this.player.animations.add('airPunch', [47,48], 9, false);
		
	
    // Define movement constants
    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 2500; // pixels/second/second
    this.DRAG = 500; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -700; // pixels/second (negative y is up)
    
    this.punching = false;
	this.timePunching = 0;
	
	this.punchUnlocked = false;
	this.doubleJumpUnlocked = false;       
    
	
    // Enable physics on the player
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.body.drag.setTo(this.DRAG, 0); // x, y

    // Since we're jumping we need gravity
    game.physics.arcade.gravity.y = this.GRAVITY;

    // Flag to track if the jump button is pressed
    this.jumping = false;


	//Set the size of the world
	this.game.world.setBounds(0,0,3000,1000);
	
	//Set camera to follow the player
	this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
	
	
    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < 1000; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, 400, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
    
    for(var x = 350; x < 650; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, 200, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
    
    for(var x = 900; x < 1300; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, 600, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
    
    for(var x = 1600; x < 1800; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, 600, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
    
    for(var x = 1900; x < 2300; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, 500, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
    
    this.spikes = this.game.add.group();
    for(var x = 0; x < 3000; x += 32) {
        var spikeBlock = this.game.add.sprite(x, this.game.height + 500, 'spikes');
        this.game.physics.enable(spikeBlock, Phaser.Physics.ARCADE);
        spikeBlock.body.immovable = true;
        spikeBlock.body.allowGravity = false;
        spikeBlock.scale.setTo(2,2);
        this.spikes.add(spikeBlock);
    }
    
    this.punchPowerUp = this.game.add.sprite(10, 330, 'powerUp');
    this.game.physics.enable(this.punchPowerUp, Phaser.Physics.ARCADE);
    this.punchPowerUp.body.immovable = true;
    this.punchPowerUp.body.allowGravity = false;
    
    this.doubleJumpPowerUp = this.game.add.sprite(2260, 430, 'powerUp');
    this.game.physics.enable(this.doubleJumpPowerUp, Phaser.Physics.ARCADE);
    this.doubleJumpPowerUp.body.immovable = true;
    this.doubleJumpPowerUp.body.allowGravity = false;
    
    this.end = this.game.add.sprite(500, 140, 'end');
    this.game.physics.enable(this.end, Phaser.Physics.ARCADE);
    this.end.body.immovable = true;
    this.end.body.allowGravity = false;
    this.end.scale.setTo(2,2);
    
    this.crate = this.game.add.sprite(900, 195, 'crate');
    this.game.physics.enable(this.crate, Phaser.Physics.ARCADE);
    this.crate.body.immovable = true;
    this.crate.body.allowGravity = false;
    this.crate.scale.setTo(0.2,0.4);

    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.SPACEBAR,
        Phaser.Keyboard.Q
    ]);

};

// The update() method is called every frame
GameState.prototype.update = function() {
    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player, this.ground);
    
    this.game.physics.arcade.overlap(this.player, this.spikes, this.hitSpikes, null, this);
	
	this.game.physics.arcade.overlap(this.player, this.punchPowerUp, this.getPunch, null, this);
	
	this.game.physics.arcade.overlap(this.player, this.doubleJumpPowerUp, this.getDoubleJump, null, this);
	
	this.game.physics.arcade.overlap(this.player, this.end, this.win, null, this);
	
	this.game.physics.arcade.overlap(this.player, this.crate, this.hitCrate, null, this);
	
	// Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.touching.down;
    
    
    if (this.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.acceleration.x = -this.ACCELERATION;
        
        this.player.scale.setTo(-2, 2);
        
        if(onTheGround && !this.punching) {
        	this.player.animations.play('walk');
        }
        
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
        
        this.player.scale.setTo(2,2);
        
        if(onTheGround && !this.punching) {
        	this.player.animations.play('walk');
        }
        
    } else {
        this.player.body.acceleration.x = 0;
        
        if(onTheGround && !this.punching) {
        	this.player.animations.play('idle');
        }
    }
	
	if(this.punching) {
		this.timePunching += this.game.time.elapsed;
		console.log(this.timePunching);
	}
	
    if(this.punchUnlocked && this.actionButtonActive()) {
    	this.punching = true;
    	if(this.input.keyboard.downDuration(Phaser.Keyboard.Q, 5)) {
    		this.timePunching = 0;
    	}
    	if(onTheGround) {
    		this.player.animations.play('punch');
    	} else {
    		this.player.animations.play('airPunch');
    	}
    }
    
    if(this.timePunching > 400) {
    	this.punching = false;
    }

    // If the player is touching the ground, let him have 2 jumps
    if (onTheGround) {
    	if(this.doubleJumpUnlocked) {
        	this.jumps = 2;
        } else {
        	this.jumps = 1;
        }
        this.jumping = false;
    }

    // Jump! Keep y velocity constant while the jump button is held for up to 150 ms
    if (this.jumps > 0 && this.upInputIsActive(150)) {
        this.player.body.velocity.y = this.JUMP_SPEED;
        this.jumping = true;
        if(this.upInputIsActive(5)) {
        	this.player.animations.play('jump');
        	this.grunt.play('jumpGrunt');
        }
    }

    // Reduce the number of available jumps if the jump input is released
    if (this.jumping && this.upInputReleased()) {
        this.jumps--;
        this.jumping = false;
    }
};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
	
    return isActive;
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    
    return isActive;
};

// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
GameState.prototype.upInputIsActive = function(duration) {
    var isActive = false;

    isActive = this.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, duration);
    
    return isActive;
};

// This function returns true when the player releases the "jump" control
GameState.prototype.upInputReleased = function() {
    var released = false;

    released = this.input.keyboard.upDuration(Phaser.Keyboard.SPACEBAR);
    
    return released;
};

GameState.prototype.actionButtonActive = function() {
	var isActive = false;
	
	isActive = this.input.keyboard.isDown(Phaser.Keyboard.Q);
	
	return isActive;
};

GameState.prototype.hitSpikes = function() {
	this.style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
    this.text = this.game.add.text(this.game.width/2 + 200, this.game.height / 2 - 100, "Try Again.", this.style);
    //player.reset(this.game.width/2 + 200, this.game.height / 2, 1);
};

GameState.prototype.getDoubleJump = function() {
	this.doubleJumpUnlocked = true;
	this.doubleJumpPowerUp.kill();
};

GameState.prototype.getPunch = function() {
	this.punchUnlocked = true;
	this.punchPowerUp.kill();
};

GameState.prototype.win = function() {
	this.style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
    this.text = this.game.add.text(470, 100, "You Win.", this.style);
};

GameState.prototype.hitCrate = function() {
	if(this.punching) {
		this.crate.kill();
	} else {
		this.game.physics.arcade.collide(this.player, this.crate);
	}
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);