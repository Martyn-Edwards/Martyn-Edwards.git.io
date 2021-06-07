<?php
/**
 * Platform button configurations
 *
 * The template wrapper for the platform button configurations.
 *
 * @package ShareThisReactionButtons
 */

?>
<div class="inline-reaction-platform platform-config-wrapper">
	<hr>

	<h4 style="text-align: left; font-size: 15px;"><?php echo esc_html__( 'Design', 'sharethis-reaction-buttons' ); ?></h4>
	<div class="st-design-message"><?php echo esc_html__( 'Use the settings below to update the look of your reaction buttons. We cache your button configurations to improve their performance. Any changes you make in the section may take up to five minutes to appear on your site.', 'sharethis-reaction-buttons' ); ?></div>

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
</div>
