// --- 1. סצנת המשחק הראשית (Main Scene) ---
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    // טעינת הנכסים (טקסטורות, תמונות, סאונד)
    preload() {
        // טעינת גרפיקה בסיסית מוכנה משרתי Phaser
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('star', 'https://labs.phaser.io/assets/demoscene/star.png');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    }

    // יצירת האלמנטים בעולם המשחק
    create() {
        // 1. רקע
        this.add.image(400, 300, 'sky');

        // 2. קבוצת פלטפורמות סטטיות (פיזיקה)
        this.platforms = this.physics.add.staticGroup();
        // רצפה ראשית
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        // פלטפורמות באוויר
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // 3. השחקן (מנגנון פיזיקה דינמי)
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2); // אלסטיות קלה
        this.player.setCollideWorldBounds(true); // מניעת יציאה מגבולות המסך

        // התנגשות בין השחקן לפלטפורמות
        this.physics.add.collider(this.player, this.platforms);

        // 4. כוכבים לאיסוף
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 7,
            setXY: { x: 50, y: 0, stepX: 100 }
        });

        this.stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        
        // מנגנון איסוף כוכבים
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // 5. ניקוד
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'ניקוד: 0', { 
            fontSize: '24px', 
            fill: '#ffffff',
            fontFamily: 'Arial'
        });

        // 6. הגדרת המקשים למקלדת
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // הלולאה הראשית של המשחק (רצה עשרות פעמים בשנייה)
    update() {
        if (!this.cursors) return;

        // תנועה שמאלה
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        }
        // תנועה ימינה
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
        // עמידה במקום
        else {
            this.player.setVelocityX(0);
        }

        // קפיצה (רק אם השחקן נוגע ברצפה/פלטפורמה)
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    // פונקציית עזר לאיסוף כוכב
    collectStar(player, star) {
        star.disableBody(true, true); // העלמת הכוכב
        this.score += 10;
        this.scoreText.setText('ניקוד: ' + this.score);
    }
}

// --- 2. הגדרות הקונפיגורציה של מנוע Phaser ---
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, // כוח כבידה
            debug: false // שנה ל-true אם ברצונך לראות את גבולות ההתנגשות (Hitboxes)
        }
    },
    scene: MainScene
};

// אתחול המשחק
const game = new Phaser.Game(config);
