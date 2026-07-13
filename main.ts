/**
 * Joke freemium mechanics for MakeCode Arcade projects.
 */
//% color="#FFD700" weight=100 icon="\uf084" block="Freemium"
//% groups=['Premium', 'Charged Blocks', 'Credits', 'Ads', 'others']
namespace freemium {
	const STARTING_CREDITS = 100;
	const AD_REWARD_CREDITS = 50;
	const AD_DURATION_MS = 10000;
	const PREMIUM_SETTING_KEY = "freemium-premium";

	let creditBalance = STARTING_CREDITS;
	let premiumUnlocked = false;
	let adActive = false;
	let adQueued = false;
	let hudCreated = false;

	function initialize() {
		premiumUnlocked = settings.readNumber(PREMIUM_SETTING_KEY) === 1;
		ensureHud();
	}

	function ensureHud() {
		if (hudCreated) {
			return;
		}

		hudCreated = true;
		scene.createRenderable(scene.HUD_Z + 1, function (target: Image, camera: scene.Camera) {
			if (premiumUnlocked || adActive) {
				return;
			}

			const text = "Credits: " + creditBalance;
			const textWidth = text.length * 6;
			const x = screen.width - textWidth - 8;
			const y = screen.height - 10;
			target.fillRect(x - 1, y - 1, textWidth + 2, 8, 15);
			target.print(text, x, y, 2);
		});
	}

	function queueAd(message: string) {
		if (adActive || adQueued || premiumUnlocked) {
			return;
		}

		adQueued = true;
		control.runInParallel(function () {
			pause(1);
			adQueued = false;
			showAd(message);
		});
	}

	function finishAd() {
		if (!adActive) {
			return;
		}

		creditBalance = AD_REWARD_CREDITS;
		adActive = false;
		game.popScene();
	}

	/**
	 * Runs a chargeable action. Internal extension wrappers call this before
	 * delegating to an Arcade API.
	 */
	function beginChargedAction(): boolean {
		if (premiumUnlocked) {
			return true;
		}

		if (adActive || creditBalance <= 0) {
			showAd("OUT OF CREDITS");
			return false;
		}

		creditBalance--;
		return true;
	}

	/**
	 * Completes a chargeable action and schedules an ad after the final paid use.
	 */
	function completeChargedAction() {
		if (!premiumUnlocked && creditBalance === 0) {
			queueAd("OUT OF CREDITS");
		}
	}

	/**
	 * Shows the current number of credits.
	 */
	//% blockId=freemium_credits block="credits remaining"
	//% group="Credits" weight=100
	export function credits(): number {
		return creditBalance;
	}

	/**
	 * Returns whether premium is currently unlocked.
	 */
	//% blockId=freemium_is_premium block="premium is unlocked"
	//% group="Premium" weight=90
	export function isPremium(): boolean {
		return premiumUnlocked;
	}

	/**
	 * Unlock premium features with the joke subscription key.
	 */
	//% blockId=freemium_enter_license_key block="unlock premium with key $key"
	//% key.defl="ENTER KEY HERE"
	//% group="Premium" weight=100
	export function enterLicenseKey(key: string) {
		if (key !== "SUBSCRIBE") {
			return;
		}

		premiumUnlocked = true;
		settings.writeNumber(PREMIUM_SETTING_KEY, 1);
		game.splash("Premium Unlocked!");
	}

	/**
	 * Shows an unskippable fake ad and restores a small number of credits.
	 */
	//% blockId=freemium_show_ad block="show fake ad $message"
	//% message.defl="OUT OF CREDITS"
	//% group="Ads" weight=100 advanced=true
	export function showAd(message: string) {
		if (adActive || premiumUnlocked) {
			return;
		}

		adQueued = false;
		adActive = true;
		game.pushScene();
		scene.createRenderable(scene.HUD_Z + 10, function (target: Image, camera: scene.Camera) {
			target.fill(15);
			target.fillRect(8, 18, screen.width - 16, screen.height - 36, 1);
			target.drawRect(8, 18, screen.width - 16, screen.height - 36, 5);
			target.print("ADVERTISEMENT", 34, 30, 5);
			target.print(message, 16, 50, 1);
			target.print("Wait 10 seconds...", 16, 76, 1);
		});

		control.runInParallel(function () {
			pause(AD_DURATION_MS);
			finishAd();
		});
	}

	/**
	 * Creates a sprite and charges one credit in free mode.
	 */
	//% blockId=freemium_create_sprite block="buy sprite $img=screen_image_picker of kind $kind=spritetype"
	//% blockSetVariable=mySprite
	//% group="Charged Blocks" weight=100
	export function createSprite(img: Image, kind: number): Sprite {
		if (!beginChargedAction()) {
			return <Sprite><any>null;
		}

		const sprite = sprites.create(img, kind);
		completeChargedAction();
		return sprite;
	}

	/**
	 * Destroys a sprite and charges one credit in free mode.
	 */
	//% blockId=freemium_destroy_sprite block="buy destroy $sprite=variables_get(mySprite)"
	//% sprite.defl=mySprite
	//% group="Charged Blocks" weight=95
	export function destroySprite(sprite: Sprite) {
		if (!beginChargedAction()) {
			return;
		}

		if (sprite) {
			sprite.destroy();
		}
		completeChargedAction();
	}

	/**
	 * Moves a sprite and charges one credit in free mode.
	 */
	//% blockId=freemium_set_sprite_position block="buy set $sprite=variables_get(mySprite) position to x $x y $y"
	//% sprite.defl=mySprite
	//% group="Charged Blocks" weight=90
	export function setSpritePosition(sprite: Sprite, x: number, y: number) {
		if (!beginChargedAction()) {
			return;
		}

		if (sprite) {
			sprite.setPosition(x, y);
		}
		completeChargedAction();
	}

	/**
	 * Changes a sprite's velocity and charges one credit in free mode.
	 */
	//% blockId=freemium_set_sprite_velocity block="buy set $sprite=variables_get(mySprite) velocity to vx $vx vy $vy"
	//% sprite.defl=mySprite
	//% group="Charged Blocks" weight=85
	export function setSpriteVelocity(sprite: Sprite, vx: number, vy: number) {
		if (!beginChargedAction()) {
			return;
		}

		if (sprite) {
			sprite.vx = vx;
			sprite.vy = vy;
		}
		completeChargedAction();
	}

	/**
	 * Enables controller movement for a sprite and charges one credit in free mode.
	 */
	//% blockId=freemium_move_sprite block="buy move $sprite=variables_get(mySprite) with buttons || vx $vx vy $vy"
	//% sprite.defl=mySprite
	//% vx.defl=100 vy.defl=100
	//% group="Charged Blocks" weight=80
	export function moveSpriteWithButtons(sprite: Sprite, vx: number = 100, vy: number = 100) {
		if (!beginChargedAction()) {
			return;
		}

		controller.moveSprite(sprite, vx, vy);
		completeChargedAction();
	}

	/**
	 * Runs chargeable code when the A button is pressed.
	 */
	//% blockId=freemium_on_a_pressed block="on bought A button pressed"
	//% group="Charged Blocks" weight=75
	export function onAButtonPressed(handler: () => void) {
		controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
			if (!beginChargedAction()) {
				return;
			}

			handler();
			completeChargedAction();
		});
	}

	/**
	 * Sets the scene background color and charges one credit in free mode.
	 */
	//% blockId=freemium_set_background_color block="buy set background color to $color=colorindexpicker"
	//% group="Charged Blocks" weight=70
	export function setBackgroundColor(color: number) {
		if (!beginChargedAction()) {
			return;
		}

		scene.setBackgroundColor(color);
		completeChargedAction();
	}

	/**
	 * Makes the camera follow a sprite and charges one credit in free mode.
	 */
	//% blockId=freemium_camera_follow_sprite block="buy camera follow $sprite=variables_get(mySprite)"
	//% sprite.defl=mySprite
	//% group="Charged Blocks" weight=65
	export function cameraFollowSprite(sprite: Sprite) {
		if (!beginChargedAction()) {
			return;
		}

		scene.cameraFollowSprite(sprite);
		completeChargedAction();
	}

	initialize();
}
// End of freemium extension.
