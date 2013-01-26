#!/usr/bin/env ruby
# encoding: utf-8

# The cryptic links are actually base16 encoded, with CRB and CRE guard
# blocks in the beginning/end. So, the links are like this:
# …zv_portal/zv?px=CRB«here be base16»CRE

plan = "http://www.studentenwerk.uni-heidelberg.de/zv_portal/zv?zv_action=CH_PAGE&zv_value=SWD_HD_Essen_HD_Speiseplan"
form = "http://www.studentenwerk.uni-heidelberg.de/zv_portal/zv?zv_action=CH_PAGE&zv_value=SWD_HD_Essen_HD_LobTadel"
save_plan_path = "/home/stefan/public_html/mensa/data.json"
save_form_path = "/home/stefan/public_html/mensa/form.html"

require "rubygems"
require "mechanize"
require "pp"
require "json"
require "date"

class String
  def clean
    self.downcase.gsub(/[^a-z0-9]/, "")
  end

  def lesser_clean
    x = self.gsub(/\((?:[1-9]+,?)+\)$/, "").strip
    x
  end
end

unless Date.today.saturday? || Date.today.sunday?
  data = {}

  a = Mechanize.new
  a.content_encoding_hooks << lambda{|httpagent, uri, response, body_io|
    response['content-encoding'] = nil if response['content-encoding'] == 'ISO-8859-15'
  }

  a.get(plan) do |page|
    # iterate over table rows
    page.search("div[id=textbereich]/table").first.search("tr").each do |tr|
      t = tr.search("td/text()")
      name = t[0].to_s.lesser_clean
      aufgang = t[1].to_s.clean
      if aufgang.size > 4
        name = [name, t[1].to_s.lesser_clean]
        aufgang = t[2].to_s.clean
      end
      next if aufgang.empty? || name.empty?
      data[aufgang] ||= []
      data[aufgang] << name
    end
  end

  f = {}
  f[:d] = {}
  f[:d][:fleisch] = data["d"].select { |x| !x.include?("(veget.)") }.first
  f[:d][:veget] = data["d"].select { |x| x.include?("(veget.)") }.first

  f[:e] = {}
  f[:e][:fleisch] = data["e"][1..2].select { |x| !x.include?("(veget.)") }.first
  f[:e][:veget] = data["e"][1..2].select { |x| x.include?("(veget.)") }.first
  f[:e][:beilagen] = [data["e"][0]] + data["e"][3..999]

  File.open(save_plan_path, "w") do |d|
    d.write("var data = ")
    d.write(f.to_json)
  end
end

# get the form, so we don’t need to worry about the ID-magic
page = a.get(form)
File.open(save_form_path, "w") do |d|
  d.write(%(<!DOCTYPE html>\n))
  d.write(%(<html><head><meta charset="ISO-8859-15"></head><body>))
  d.write(page.search("form[2]").to_s)
  d.write(%(</body>))
end
