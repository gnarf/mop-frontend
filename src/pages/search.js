import React from 'react'

const SearchPage = () => (
	<div className="container background-moveon-white bump-top-1">
		<div className="row">
			<div className="span12">
				<h2 id="title" className="light">Top petitions</h2>
				<p>
				You can search for petitions by issue, title, author, target, city, state, or keyword &mdash; or check out <a href="/victories.html">recent victories</a>.
				</p>

				<div id="search-form-div">

					<form className="form-vertical">

					<div className="search">
					<input name="q" type="text" id="search-box2" class="margin-top-0 margin-right-2" value="" />
					<button type="submit" className="background-moveon-dark-blue"> Search</button>
					</div>
					<div className="clear"></div>

					</form>
				</div>

				<div id="search-results">

					<div className="result">
						<div className="result-text">
							<p className="result-name">
							<a className="size-medium-large font-heavy" href="http://pac.petitions.moveon.org/sign/support-the-student-loan/?source=search">
							    Support Student Loan Forgiveness
							</a>
							</p>
							<p className="size-small">http://pac.petitions.moveon.org/sign/support-the-student-loan/</p>
							<p className="size-medium">Total outstanding student loan debt in America is expected to exceed $1.4 TRILLION this year. Millions of hardworking, taxpaying, educated Americans are being crushed under the weight of their educati...</p>
						</div>

					</div>

				</div>


				<div className="pagination">
					<ul>
						<li className="disabled"><a href="#" onclick="javascript: return false;">&#171;</a></li>
						<li className="active"><a href="?page=1&amp;">1</a></li>
						<li className=""><a href="?page=2&amp;">2</a></li>
						<li className=""><a href="?page=3&amp;">3</a></li>
						<li className=""><a href="?page=4&amp;">4</a></li>
						<li><a href="?page=2&">&#187;</a></li>
					</ul>

					<p><small>Found 46269 results in 0.007s.</small></p>

				</div>
			</div>
		</div>
	</div>
)

export default SearchPage
