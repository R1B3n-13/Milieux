package com.milieux.ecomm.store;

import java.util.List;

public record Store(
    Integer id,
    String name,
    Integer ui_type,
    String ui_font,
    String ui_font_special,
    String ui_accent_color,
    String ui_base_color,
    String ui_secondary_color,
    String banner,
    String banner_subtext,
    String logo_url,
    List <String> ui_images,
    List <Integer> top_items
) {
}
