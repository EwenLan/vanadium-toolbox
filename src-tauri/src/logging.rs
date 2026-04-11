/// logging 添加依赖 cargo add chrono log log4rs
use chrono::Local;
use log::LevelFilter;
use log4rs::{
    append::{console::ConsoleAppender, file::FileAppender},
    config::{Appender, Config, Root},
    encode::pattern::PatternEncoder,
};

pub fn init_logger() -> Result<(), Box<dyn std::error::Error>> {
    // 创建日志目录
    std::fs::create_dir_all("log")?;

    // 生成日期格式的文件名
    let log_file = format!("log/{}.log", Local::now().format("%Y-%m-%d"));

    let def_pattern = "{h([{l}])}[{d(%Y-%m-%d %H:%M:%S)}][{i}][{f}:{L}][{m}]{n}";

    // 配置控制台输出
    let stdout = ConsoleAppender::builder()
        .encoder(Box::new(PatternEncoder::new(&def_pattern)))
        .build();

    // 配置文件输出
    let file = FileAppender::builder()
        .encoder(Box::new(PatternEncoder::new(&def_pattern)))
        .build(log_file)?;

    // 构建日志配置
    let config = Config::builder()
        .appender(Appender::builder().build("stdout", Box::new(stdout)))
        .appender(Appender::builder().build("file", Box::new(file)))
        .build(
            Root::builder()
                .appender("stdout")
                .appender("file")
                .build(LevelFilter::Debug),
        )?;
    log4rs::init_config(config)?;
    Ok(())
}
