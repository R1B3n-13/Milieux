package com.milieux.ecomm.store;

import java.util.List;

public record Store(
    Integer id,
    String name,
    Integer ui_type,
    String ui_font,
    String ui_font_special,
    String ui_accent_color,
    String banner,
    List <String> ui_images
) {
}
