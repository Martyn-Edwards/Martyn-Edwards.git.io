<?php
/**
 * Step One Template
 *
 * The template wrapper for the step one set up page.
 *
 * @package ShareThisReactionButtons
 */

?>
<div id="sharethis-step-one-wrap">
	<div class="sharethis-setup-steps">
		<?php
		foreach ( $setup_steps as $num => $step ) :
			$step_class = 1 === $num ? 'current-step' : '';
			?>
			<span class="step-num <?php echo esc_attr( $step_class ); ?>"><?php echo esc_html( $num ); ?></span>

			<div class="step-description"><?php echo esc_html( $step ); ?></div>

			<span class="step-spacer"></span>
		<?php endforeach; ?>
	</div>

	<h1><?php echo esc_html__( 'Let\'s get started!', 'sharethis-reaction-buttons' ); ?></h1>

	<h4 class="selected-button">
		<?php echo esc_html__( 'Thanks for choosing ShareThis! To get started, design your Reaction Buttons.', 'sharethis-reaction-buttons' ); ?>
	</h4>

	<div class="button-configuration-wrap">
		<div class="sharethis-selected-reactions">
			<div id="inline-reaction-8" class="sharethis-inline-reaction-buttons"></div>
		</div>

		<p class="st-preview-message">
			⇧ <?php echo esc_html__( 'Preview: click and drag to reorder' ); ?> ⇧
		</p>

		<h3><?php echo esc_html__( 'Reactions', 'sharethis-reaction-buttons' ); ?></h3>

		<span><?php echo esc_html__( 'click a reaction to add or remove it from your preview.', 'sharethis-reaction-buttons' ); ?></span>

		<div class="reaction-buttons">
			<?php foreach ( $reactions as $reaction_name => $image ) : ?>
				<img class="reaction-button" data-reaction="<?php echo esc_attr( $reaction_name ); ?>" data-selected="true" alt="<?php echo esc_attr( $reaction_name ); ?>" src="<?php echo esc_attr( $image ); ?>">
			<?php endforeach; ?>
		</div>

		<hr>

		<div class="button-alignment">
			<h3>Alignment</h3>

			<div class="alignment-button" data-alignment="left" data-selected="false">
				<div class="top">
					<div class="box"></div>
					<div class="box"></div>
					<div class="box"></div>
				</div>
				<div class="bottom">Left</div>
			</div>

			<div class="alignment-button" data-alignment="center" data-selected="true">
				<div class="top">
					<div class="box"></div>
					<div class="box"></div>
					<div class="box"></div>
				</div>
				<div class="bottom">Center</div>
			</div>

			<div class="alignment-button" data-alignment="right" data-selected="false">
				<div class="top">
					<div class="box"></div>
					<div class="box"></div>
					<div class="box"></div>
				</div><div class="bottom">Right</div>
			</div>
		</div>
		<div class="language-config">
			<h3 class="center"><?php echo esc_html__( 'Languages', 'sharethis-reaction-buttons' ); ?></h3>

			<span class="select-field">
			<select id="st-language">
				<?php foreach ( $languages as $language_name => $code ) : ?>
					<option class="language-option" value="<?php echo esc_attr( $code ); ?>">
						<?php echo esc_html( $language_name ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</span>
		</div>

		<hr>

		<h4><?php echo esc_html__( 'Ooooo that\'s hot. Click register & configure to complete installation!', 'sharethis-reaction-buttons' ); ?></h4>

		<a href="#" class="st-rc-link set-congif">REGISTER</a>
	</div>
	<div class="sharethis-login-message">
		<?php echo esc_html__( 'Already have a ShareThis account?', 'sharethis-share-buttons' ); ?>

		<a href="?page=sharethis-general&l=t">
			<?php echo esc_html__( 'Login and connect your property', 'sharethis-share-buttons' ); ?>
		</a>
	</div>
</div>
