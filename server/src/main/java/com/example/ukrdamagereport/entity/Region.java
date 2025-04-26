package com.example.ukrdamagereport.entity;

public enum Region {
    VINNYTSKA("vinnytska", "Vinnytska", "Вінницька область"),
    VOLYNSKA("volynska", "Volynska", "Волинська область"),
    DNIPROPETROVSKA("dnipropetrovska", "Dnipropetrovska", "Дніпропетровська область"),
    DONETSKA("donetska", "Donetska", "Донецька область"),
    ZHYTOMYRSKA("zhytomyrska", "Zhytomyrska", "Житомирська область"),
    ZAKARPATSKA("zakarpatska", "Zakarpatska", "Закарпатська область"),
    ZAPORIZKA("zaporizka", "Zaporizka", "Запорізька область"),
    IVANO_FRANKIVSKA("ivano-frankivska", "Ivano-Frankivska", "Івано-Франківська область"),
    KYIVSKA("kyivska", "Kyivska", "Київська область"),
    KIROVOHRADSKA("kirovohradska", "Kirovohradska", "Кіровоградська область"),
    LUHANSKA("luhanska", "Luhanska", "Луганська область"),
    LVIVSKA("lvivska", "Lvivska", "Львівська область"),
    MYKOLAIVSKA("mykolaivska", "Mykolaivska", "Миколаївська область"),
    ODESKA("odesska", "Odeska", "Одеська область"),
    POLTAVSKA("poltavska", "Poltavska", "Полтавська область"),
    RIVNENSKA("rivnenska", "Rivnenska", "Рівненська область"),
    SUMSKA("sumska", "Sumska", "Сумська область"),
    TERNOPILSKA("ternopilska", "Ternopilska", "Тернопільська область"),
    KHARKIVSKA("kharkivska", "Kharkivska", "Харківська область"),
    KHERSONSKA("khersonska", "Khersonska", "Херсонська область"),
    KHMELNYTSKA("khmelnytska", "Khmelnytska", "Хмельницька область"),
    CHERKASKA("cherkaska", "Cherkaska", "Черкаська область"),
    CHERNIVETSKA("chernivetska", "Chernivetska", "Чернівецька область"),
    CHERNIHIVSKA("chernihivska", "Chernihivska", "Чернігівська область"),
    CRIMEA("crimea", "Autonomous Republic of Crimea", "АР Крим"),
    KYIV("kyiv", "Kyiv", "м. Київ");

    private final String id;
    private final String value;
    private final String name;

    Region(String id, String value, String name) {
        this.id = id;
        this.value = value;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    public static Region fromString(String text) {
        for (Region region : Region.values()) {
            if (region.value.equalsIgnoreCase(text)) {
                return region;
            }
        }
        throw new IllegalArgumentException("No constant with text " + text + " found");
    }
} 